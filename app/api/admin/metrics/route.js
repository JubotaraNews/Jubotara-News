export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import News from "@/models/News";
import User from "@/models/User";
import Ads from "@/models/Ads";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const [newsCount, userCount, adsCount, videoCount] = await Promise.all([
      News.countDocuments({}),
      User.countDocuments({}),
      Ads.countDocuments({}),
      Video.countDocuments({}),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        news: newsCount,
        users: userCount,
        ads: adsCount,
        videos: videoCount,
      },
    });
  } catch (error) {
    console.error("GET Metrics Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
