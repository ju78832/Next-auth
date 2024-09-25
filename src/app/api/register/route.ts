import { NextRequest, NextResponse } from "next/server";
import User from "@/models/db";
import bcrypt from "bcryptjs";
import dbConnect from "@/helper/dbConnect";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  await dbConnect();
  try {
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { message: "User Already Exist" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return NextResponse.json({ message: "User Registered" });
  } catch (error: any) {
    console.log("Unwanted Error");
    return NextResponse.json(error.message);
  }
}
