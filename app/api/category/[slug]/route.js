import { NextResponse } from "next/server";
import Category from "@/models/Category";
import News from "@/models/News";
import dbConnect from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// GET category by slug
export async function GET(req, { params }) {
  try {
    await dbConnect();

    // unwrap params
    const { slug } = await params;
    console.log("Slug from params:", slug);

    const category = await Category.findOne({ slug });
    console.log("Category found:", category);

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, category }, { status: 200 });
  } catch (error) {
    // Narrow the unknown type to Error
    const err = error instanceof Error ? error : new Error("Unknown error");
    console.error("GET /api/category/[slug] error:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 },
    );
  }
}

// DELETE category by slug (Protected)
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // unwrap params
    const { slug } = await params;

    // Check if category exists
    const category = await Category.findOne({ slug });
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 },
      );
    }

    // Check if there are any news items in this category
    const newsCount = await News.countDocuments({ category: category.name });
    if (newsCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot delete category "${category.name}" because it contains ${newsCount} news item(s). Please reassign or delete the news items first.`,
        },
        { status: 400 },
      );
    }

    // Delete the category
    await Category.findOneAndDelete({ slug });

    return NextResponse.json(
      { success: true, message: "Category deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    // Narrow the unknown type to Error
    const err = error instanceof Error ? error : new Error("Unknown error");
    console.error("DELETE /api/category/[slug] error:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 },
    );
  }
}
