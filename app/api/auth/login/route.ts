import { type NextRequest, NextResponse } from "next/server"
import { ADMIN_CREDENTIALS, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Simple credential check (in production, use database)
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const token = generateToken({
        id: "1",
        email: ADMIN_CREDENTIALS.email,
        role: "admin",
      })

      return NextResponse.json({ token })
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
