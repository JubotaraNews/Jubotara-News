import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import News from "@/models/News";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await dbConnect();
    const url = request.nextUrl;
    
    // Fetch by category
    const category = url.searchParams.get("category") || "all";
    const query = {};
    if (category && category !== "all")
      query.category = decodeURIComponent(category);

    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const newsheadline = await News.find(query, "title")
      .sort({ createdAt: -1 })
      .limit(20);

    const totalNewsCount = await News.countDocuments({});
    const filteredNewsCount = await News.countDocuments(query);
    
    const news = await News.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: news,
      newsheadline,
      totalCount: totalNewsCount,
      filteredCount: filteredNewsCount,
      currentPage: page,
      totalPages: Math.ceil(filteredNewsCount / limit),
    });
  } catch (error) {
    console.error("GET News Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch news",
        error: error instanceof Error ? error.message : null,
      },
      { status: 500 },
    );
  }
}

// POST new news (Protected)
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const news = await News.create(body);
    return NextResponse.json({ success: true, data: news }, { status: 201 });
  } catch (error) {
    console.error("POST News Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
