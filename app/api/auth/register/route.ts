import { type NextRequest, NextResponse } from "next/server";
import { createUser, verifyToken } from "@/lib/auth";
import { z } from "zod";

// Input validation schema
const RegisterSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["admin", "user"]).optional().default("user"),
});

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin (for creating new admins)
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const tokenPayload = verifyToken(token);

      // Only admins can create other users
      if (!tokenPayload || tokenPayload.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    } else {
      // For the first admin creation, we'll allow it if no users exist
      // This will be handled in the createUser function
    }

    const body = await request.json();

    // Validate input
    const validation = RegisterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { email, password, firstName, lastName, role } = validation.data;

    try {
      const user = await createUser({
        email,
        password,
        firstName,
        lastName,
        role,
      });

      if (user) {
        return NextResponse.json(
          {
            message: "User created successfully",
            user: {
              id: user._id?.toString(),
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
            },
          },
          { status: 201 }
        );
      }

      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    } catch (error: any) {
      if (error.message === "User with this email already exists") {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 409 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
