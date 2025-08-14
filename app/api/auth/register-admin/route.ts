import { type NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/auth";
import { z } from "zod";

// Input validation schema
const RegisterAdminSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["admin", "user"]).optional().default("admin"),
  accessPassword: z.string().min(1, "Access password is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = RegisterAdminSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { email, password, firstName, lastName, role, accessPassword } =
      validation.data;

    // Verify access password
    const registrationPassword = process.env.ADMIN_REGISTRATION_PASSWORD;

    if (!registrationPassword) {
      return NextResponse.json(
        { error: "Registration access not configured" },
        { status: 503 }
      );
    }

    if (accessPassword !== registrationPassword) {
      return NextResponse.json(
        { error: "Invalid access password" },
        { status: 401 }
      );
    }

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
            message: "Admin user created successfully",
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
    console.error("Admin registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
