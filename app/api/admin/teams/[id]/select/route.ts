import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verify admin token
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { selected } = await request.json()
    const db = await getDatabase()

    const result = await db
      .collection("teamregistrations")
      .updateOne({ _id: new ObjectId(params.id) }, { $set: { selected: Boolean(selected) } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating team selection:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
