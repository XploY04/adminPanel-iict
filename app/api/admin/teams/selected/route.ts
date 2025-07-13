import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const teams = await db.collection("teamregistrations").find({ selected: true }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ teams })
  } catch (error) {
    console.error("Error fetching selected teams:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
