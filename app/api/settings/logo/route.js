import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Logo from "@/models/Logo";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    await dbConnect();
    const logos = await Logo.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, logos });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: "Failed to fetch logo" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const formData = await req.formData();
    const file = formData.get("logo");

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 },
      );
    }

    const cloudinaryData = await uploadToCloudinary(file);
    const updatedLogo = await Logo.findOneAndUpdate(
      {},
      {
        logoUrl: cloudinaryData.secure_url,
        publicId: cloudinaryData.public_id,
      },
      { new: true, upsert: true },
    );

    return NextResponse.json({
      success: true,
      message: "Logo uploaded",
      logoUrl: updatedLogo.logoUrl,
    });
  } catch (err) {
    console.log("Upload error:", err);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    await Logo.findOneAndUpdate({}, { logoUrl: null });

    return NextResponse.json({
      success: true,
      message: "Logo removed",
    });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: "Failed to remove logo" }, { status: 500 });
  }
}
