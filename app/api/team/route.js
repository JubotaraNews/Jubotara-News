import { NextResponse } from "next/server";
import Member from "@/models/Member";
import dbConnect from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const dynamic = "force-dynamic";

// GET: Fetch all members, sorted by order
export async function GET() {
  try {
    await dbConnect();
    const members = await Member.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, members }, { status: 200 });
  } catch (error) {
    console.error("GET /api/team error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

// POST: Create a new member (Protected)
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await req.json();
    const { name, designation, image, section, isHead, order } = data;

    if (!name || !designation || !image || !section) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    const member = await Member.create({
      name,
      designation,
      image,
      section,
      isHead: isHead || false,
      order: order || 0,
    });

    return NextResponse.json({ success: true, member }, { status: 201 });
  } catch (error) {
    console.error("POST /api/team error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
