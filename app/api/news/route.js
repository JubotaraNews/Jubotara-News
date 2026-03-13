import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import News from "@/models/News";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const url = request.nextUrl;
    
    // Status filter (default to published for public)
    const requestedStatus = url.searchParams.get("status");
    const category = url.searchParams.get("category") || "all";
    
    const query = {};
    
    if (requestedStatus) {
      // If status is requested, check if user is authorized to see it
      if (session && (session.user.role === "admin" || session.user.role === "user")) {
        if (requestedStatus !== "all") {
          query.status = requestedStatus;
        }
        // If not admin, restrict to their own news if they want non-published news
        if (session.user.role !== "admin" && requestedStatus !== "published") {
          query.authorId = session.user.id;
        }
      } else {
        // Public users can ONLY see published news
        query.status = "published";
      }
    } else {
      // Default to published if no status is specified
      // But if it's an admin/user requesting without status, maybe they want all? 
      // For now, let's stick to published for public-facing components.
      // Most public components use this API.
      query.status = "published";
    }

    if (category && category !== "all")
      query.category = decodeURIComponent(category);

    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const newsheadline = await News.find({ status: "published" }, "headline")
      .sort({ createdAt: -1 })
      .limit(20);

    const totalNewsCount = await News.countDocuments({ status: "published" });
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
    if (!session || (session.user.role !== "admin" && session.user.role !== "user")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    
    // Add author info and set initial status
    const newsData = {
      ...body,
      authorId: session.user.id,
      authorName: session.user.name,
      status: session.user.role === "admin" ? (body.status || "published") : "pending",
    };

    const news = await News.create(newsData);
    return NextResponse.json({ success: true, data: news }, { status: 201 });
  } catch (error) {
    console.error("POST News Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
