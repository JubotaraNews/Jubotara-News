import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import EPaper from "@/models/EPaper";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { pageNumber, hotspots } = await req.json();

    if (!pageNumber || !hotspots) {
      return NextResponse.json(
        { error: "Page number and hotspots are required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const edition = await EPaper.findById(id);
    if (!edition) {
      return NextResponse.json({ error: "Edition not found" }, { status: 404 });
    }

    // Find the page and update its hotspots
    const page = edition.pages.find((p) => p.pageNumber === pageNumber);
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    page.hotspots = hotspots;
    await edition.save();

    return NextResponse.json({ success: true, data: edition });
  } catch (error) {
    console.error("PUT EPaper Hotspots Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
