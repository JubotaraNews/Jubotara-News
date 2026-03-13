import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import News from "@/models/News";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const dynamic = "force-dynamic";

export async function GET(req, context) {
  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await dbConnect();
    const news = await News.findById(id);
    if (!news) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    return NextResponse.json(news.toObject());
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// =========================================================
// ✅ PUT: Update single news (Protected)
// =========================================================
export async function PUT(req, context) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "admin" && session.user.role !== "user")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await dbConnect();
    const existingNews = await News.findById(id);

    if (!existingNews) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    // Permission check
    if (session.user.role !== "admin") {
      // If not admin, must be author and news must not be published
      if (existingNews.authorId?.toString() !== session.user.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
      if (existingNews.status === "published") {
        return NextResponse.json({ message: "Cannot edit published news. Please contact admin." }, { status: 403 });
      }
    }

    const data = await req.json();
    
    // Only admin can change status to "published" or "approvedBy"
    if (session.user.role !== "admin") {
      delete data.status;
      delete data.approvedBy;
    } else {
      if (data.status === "published" && !existingNews.approvedBy) {
        data.approvedBy = session.user.id;
      }
    }

    const updated = await News.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updated.toObject(), { status: 200 });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    const message =
      error instanceof Error ? error.message : "Unknown server error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// =========================================================
// ✅ DELETE: Delete single news (Protected)
// =========================================================
export async function DELETE(req, context) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "admin" && session.user.role !== "user")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: newsId } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(newsId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await dbConnect();
    const existingNews = await News.findById(newsId);

    if (!existingNews) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    // Permission check
    if (session.user.role !== "admin") {
      if (existingNews.authorId?.toString() !== session.user.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
      if (existingNews.status === "published") {
        return NextResponse.json({ message: "Cannot delete published news." }, { status: 403 });
      }
    }

    const deleted = await News.findByIdAndDelete(newsId);

    return NextResponse.json({ success: true, id: newsId }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
