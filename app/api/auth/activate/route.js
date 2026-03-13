import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email, token } = body;

    if (!email || !token) {
      return NextResponse.json({ message: "Email and token are required" }, { status: 400 });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+activationToken");

    if (!user) {
      return NextResponse.json({ message: `User with email ${email} not found.` }, { status: 400 });
    }

    if (user.isActivated) {
      return NextResponse.json({ message: "This account is already activated." }, { status: 400 });
    }

    if (user.activationToken !== token.trim()) {
      return NextResponse.json({ message: "Invalid activation token." }, { status: 400 });
    }

    if (user.activationExpires && user.activationExpires < Date.now()) {
      return NextResponse.json({ message: "Activation token has expired." }, { status: 400 });
    }


    user.isActivated = true;
    user.emailVerified = true;
    user.activationToken = undefined;
    user.activationExpires = undefined;
    await user.save();

    return NextResponse.json({ message: "Account activated successfully. You can now log in." }, { status: 200 });
  } catch (error) {
    console.error("Activation Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
