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
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await dbConnect();
    const data = await req.json();

    const updated = await News.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

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
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: newsId } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(newsId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await dbConnect();
    const deleted = await News.findByIdAndDelete(newsId);

    if (!deleted) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id: newsId }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
