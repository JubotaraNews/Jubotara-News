import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import EPaper from "@/models/EPaper";

export async function GET(req, { params }) {
  try {
    const { date: dateStr } = await params;
    console.log(`Searching for EPaper edition with date string: ${dateStr}`);
    await dbConnect();

    // Parse the date string carefully. Use T00:00:00Z to force UTC interpretation of YYYY-MM-DD
    const targetDate = new Date(`${dateStr}T00:00:00Z`);
    
    if (isNaN(targetDate.getTime())) {
      console.error(`Invalid date format received: ${dateStr}`);
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    // Try multiple ways to find the date
    // 1. UTC range for that day
    const startOfDay = new Date(targetDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    console.log(`Query range (UTC): ${startOfDay.toISOString()} to ${endOfDay.toISOString()}`);

    let edition = await EPaper.findOne({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: "published"
    }).lean();

    if (!edition) {
      console.log("No edition found in UTC range, trying local range fallback...");
      // Try a wider 48-hour window just in case of severe timezone offset issues
      const wideStart = new Date(targetDate);
      wideStart.setUTCDate(wideStart.getUTCDate() - 1);
      const wideEnd = new Date(targetDate);
      wideEnd.setUTCDate(wideEnd.getUTCDate() + 1);
      
      const potentialEditions = await EPaper.find({
        date: { $gte: wideStart, $lte: wideEnd },
        status: "published"
      }).lean();

      // In JS, check which one matches the date string YYYY-MM-DD
      edition = potentialEditions.find(e => {
        const d = new Date(e.date);
        return d.toISOString().split('T')[0] === dateStr;
      });
    }

    if (!edition) {
      console.log("Still no edition found. Fetching recent available dates for debugging...");
      const allEditions = await EPaper.find({ status: "published" }, { date: 1 }).sort({ date: -1 }).limit(10).lean();
      const availableDates = allEditions.map(e => e.date.toISOString().split('T')[0]);
      console.log("Available dates in DB:", availableDates);
      
      return NextResponse.json({ 
        error: "Edition not found", 
        requestedDate: dateStr,
        availableDates: availableDates
      }, { status: 404 });
    }

    console.log("Edition found successfully!");
    return NextResponse.json({ success: true, data: edition });
  } catch (error) {
    console.error("GET EPaper by Date Error:", error);
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}
