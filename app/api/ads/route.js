import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Ads from "@/models/Ads";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    await dbConnect();
    const ads = await Ads.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: ads });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: "Failed to fetch ads" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const ad = await Ads.create(body);
    return NextResponse.json({ success: true, data: ad }, { status: 201 });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: "Failed to create ad" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ message: "ID is required" }, { status: 400 });

    await dbConnect();
    const body = await req.json();
    const updatedAd = await Ads.findByIdAndUpdate(id, body, { new: true });
    
    if (!updatedAd) return NextResponse.json({ message: "Ad not found" }, { status: 404 });
    
    return NextResponse.json({ success: true, data: updatedAd });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: "Failed to update ad" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ message: "ID is required" }, { status: 400 });

    await dbConnect();
    const deletedAd = await Ads.findByIdAndDelete(id);
    
    if (!deletedAd) return NextResponse.json({ message: "Ad not found" }, { status: 404 });
    
    return NextResponse.json({ success: true, message: "Ad deleted" });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: "Failed to delete ad" }, { status: 500 });
  }
}
