import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import EPaper from "@/models/EPaper";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { deleteFromCloudinary } from "@/utils/cloudinary";

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const edition = await EPaper.findById(id);
    if (!edition) {
      return NextResponse.json({ error: "Edition not found" }, { status: 404 });
    }

    // Delete all associated images from Cloudinary
    for (const page of edition.pages) {
      if (page.publicId) {
        await deleteFromCloudinary(page.publicId);
      }
    }

    await EPaper.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "EPaper edition deleted successfully",
    });
  } catch (error) {
    console.error("DELETE EPaper Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
