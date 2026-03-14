import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import EPaper from "@/models/EPaper";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;
    const skip = (page - 1) * limit;

    const editions = await EPaper.find({ status: "published" })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await EPaper.countDocuments({ status: "published" });

    return NextResponse.json({
      success: true,
      data: editions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET EPaper Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { date, pages, status } = body;

    if (!date || !pages || pages.length === 0) {
      return NextResponse.json(
        { error: "Date and at least one page are required" },
        { status: 400 },
      );
    }

    await dbConnect();

    // Set date to UTC midnight for consistency
    const epaperDate = new Date(date);
    epaperDate.setUTCHours(0, 0, 0, 0);

    // Use the first page as thumbnail
    const thumbnail = pages[0].imageUrl;

    // Check if edition already exists for this date
    const existingEdition = await EPaper.findOne({ 
      date: { 
        $gte: new Date(epaperDate), 
        $lte: new Date(new Date(epaperDate).setUTCHours(23, 59, 59, 999)) 
      } 
    });

    let result;
    if (existingEdition) {
      existingEdition.pages = pages;
      existingEdition.status = status || "published";
      existingEdition.thumbnail = thumbnail;
      existingEdition.date = epaperDate; // Ensure it's reset to midnight
      result = await existingEdition.save();
    } else {
      result = await EPaper.create({
        date: epaperDate,
        pages,
        status: status || "published",
        thumbnail,
      });
    }

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error("POST EPaper Error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
