import { NextResponse } from "next/server";
import Member from "@/models/Member";
import dbConnect from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const dynamic = "force-dynamic";

// PUT: Update an existing member (Protected)
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    await dbConnect();
    const data = await req.json();

    const member = await Member.findByIdAndUpdate(id, data, { new: true });
    if (!member) {
      return NextResponse.json(
        { success: false, message: "Member not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, member }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/team/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

// DELETE: Remove a member (Protected)
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    await dbConnect();

    const member = await Member.findByIdAndDelete(id);
    if (!member) {
      return NextResponse.json(
        { success: false, message: "Member not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Member deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /api/team/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
