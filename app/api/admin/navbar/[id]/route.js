import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Navbar from "@/models/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const body = await req.json();
    const updatedItem = await Navbar.findByIdAndUpdate(id, body, { new: true });
    
    if (!updatedItem) return NextResponse.json({ message: "Item not found" }, { status: 404 });
    
    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: "Failed to update navbar item" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const deletedItem = await Navbar.findByIdAndDelete(id);
    
    if (!deletedItem) return NextResponse.json({ message: "Item not found" }, { status: 404 });
    
    return NextResponse.json({ success: true, message: "Navbar item deleted" });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: "Failed to delete navbar item" }, { status: 500 });
  }
}
