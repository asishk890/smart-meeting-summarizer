// src/app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/mock-db";
import { registerSchema } from "@/lib/validations";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);
    const { name, email, password } = validatedData;

    const existingUser = await db.user.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // --- THIS IS THE FIX ---
    // Your 'create' function needs a 'role', so we provide a default one.
    await db.user.create({
      name,
      email,
      password: hashedPassword,
      role: "user", // Add this line
    });

    return NextResponse.json(
      { message: "User registered successfully!" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Invalid input", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
