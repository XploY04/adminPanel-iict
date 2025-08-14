import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Input validation schema
const VerifyAccessSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = VerifyAccessSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { password } = validation.data;

    // Check against environment variable
    const registrationPassword = process.env.ADMIN_REGISTRATION_PASSWORD;

    if (!registrationPassword) {
      return NextResponse.json(
        { error: "Registration access not configured" },
        { status: 503 }
      );
    }

    if (password === registrationPassword) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
