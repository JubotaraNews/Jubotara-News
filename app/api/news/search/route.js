import { NextResponse } from "next/server";
import { searchNews } from "@/lib/localData";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ success: true, data: [] });
    }

    const results = await searchNews(query);
    
    // Limit to top 5-7 results for the instant dropdown
    const limitedResults = results.slice(0, 7);

    return NextResponse.json({
      success: true,
      data: limitedResults,
    });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { success: false, message: "Search failed" },
      { status: 500 }
    );
  }
}
