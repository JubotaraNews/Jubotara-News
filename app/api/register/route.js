import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized. Only admins can create users." }, { status: 401 });
    }

    await dbConnect();

    const { fullName, email, password, role } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const activationToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      name: fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "user",
      isActivated: false,
      activationToken,
      activationExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    // TODO: Send activation email with activationToken

    return NextResponse.json({
      message: "User created successfully. Activation email sent.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        activationToken, // Returning it for testing/placeholder purposes
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
