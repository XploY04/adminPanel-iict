import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { z } from "zod";

// Input validation schemas
const ParamsSchema = z.object({
  id: z
    .string()
    .refine((id) => ObjectId.isValid(id), "Invalid ObjectId format"),
});

const BodySchema = z.object({
  selected: z.boolean(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin token
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate parameters
    const paramsValidation = ParamsSchema.safeParse(params);
    if (!paramsValidation.success) {
      return NextResponse.json(
        { error: "Invalid team ID format" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const bodyValidation = BodySchema.safeParse(body);
    if (!bodyValidation.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: bodyValidation.error.errors },
        { status: 400 }
      );
    }

    const { selected } = bodyValidation.data;
    const db = await getDatabase();

    // Use validated ObjectId
    const objectId = new ObjectId(paramsValidation.data.id);

    const result = await db
      .collection("teamregistrations")
      .updateOne({ _id: objectId }, { $set: { selected: selected } });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating team selection:", error);
    return NextResponse.json(
      { error: "Failed to update team selection" },
      { status: 500 }
    );
  }
}
