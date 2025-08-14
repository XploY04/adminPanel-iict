import { type NextRequest, NextResponse } from "next/server";
import { verifyToken, getUserById } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Invalid authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token || token.length === 0) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const tokenPayload = verifyToken(token);
    if (!tokenPayload) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Get fresh user data from database
    const user = await getUserById(tokenPayload.id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found or inactive" },
        { status: 401 }
      );
    }

    // Return user information
    return NextResponse.json({ user });
  } catch (error) {
    // Don't expose internal error details
    return NextResponse.json(
      { error: "Token verification failed" },
      { status: 401 }
    );
  }
}
