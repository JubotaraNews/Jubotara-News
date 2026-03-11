import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Settings from "@/models/Settings";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    await dbConnect();
    const settings = await Settings.find({});
    // Transform into a simple key-value object
    const settingsObj = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    
    return NextResponse.json({ success: true, data: settingsObj });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json(); // Expected { key, value }
    
    const updatedSetting = await Settings.findOneAndUpdate(
      { key: body.key },
      { value: body.value },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: updatedSetting });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: "Failed to update setting" }, { status: 500 });
  }
}
