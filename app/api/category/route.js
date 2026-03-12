import { NextResponse } from "next/server";
import Category from "@/models/Category";
import dbConnect from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const dynamic = "force-dynamic";

// POST: create new category (Protected)
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { name } = await req.json();

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Category name is required" },
        { status: 400 },
      );
    }

    const slug = name.toLowerCase().trim().replace(/\s+/g, "-");

    const existing = await Category.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Category already exists" },
        { status: 400 },
      );
    }

    const category = await Category.create({ name, slug });
    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error) {
    console.error("POST /api/category error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

// GET: fetch all categories
export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find().sort({ name: 1 });
    return NextResponse.json({ success: true, categories }, { status: 200 });
  } catch (error) {
    console.error("GET /api/category error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
