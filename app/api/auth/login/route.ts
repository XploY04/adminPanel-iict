import { type NextRequest, NextResponse } from "next/server";
import { authenticateUser, generateToken } from "@/lib/auth";
import { z } from "zod";

// Input validation schema
const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = LoginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Authenticate user from database
    const user = await authenticateUser(email, password);

    if (user) {
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role as "admin" | "user",
      });

      return NextResponse.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      });
    }

    // Don't reveal whether email exists or password is wrong
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
