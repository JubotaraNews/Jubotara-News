import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Navbar from "@/models/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    await dbConnect();
    const items = await Navbar.find().sort({ order: 1 });
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: "Failed to fetch navbar items" }, { status: 500 });
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
    const item = await Navbar.create(body);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: "Failed to create navbar item" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { items } = await req.json(); // For bulk update of order
    
    for (const item of items) {
      await Navbar.findByIdAndUpdate(item._id, { order: item.order });
    }

    return NextResponse.json({ success: true, message: "Navbar order updated" });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: "Failed to update navbar order" }, { status: 500 });
  }
}
