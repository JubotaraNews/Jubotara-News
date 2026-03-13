import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const users = await User.find()
      .select("+activationToken")
      .sort({ createdAt: -1 });
    const totalUserCount = await User.countDocuments({});

    return NextResponse.json({ users, totalUser: totalUserCount });
  } catch (error) {
    console.error("GET Users Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
