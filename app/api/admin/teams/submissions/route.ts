import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.replace("Bearer ", "");

        if (!token || !verifyToken(token)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const db = await getDatabase();
        
        const submissions = await db.collection("submissions").find({}).toArray();
        
        const submissionsWithTeams = await Promise.all(
            submissions.map(async (submission) => {
                try {
                    const teamId = new ObjectId(submission.team_id);
                    const team = await db.collection("teamregistrations").findOne({ _id: teamId });
                    
                    return {
                        ...submission,
                        team: team || null 
                    };
                } catch (error) {
                    console.error(`Error fetching team for submission ${submission._id}:`, error);
                    return {
                        ...submission,
                        team: null
                    };
                }
            })
        );

        return NextResponse.json({ submissions: submissionsWithTeams });
    } catch (error) {
        console.error("Error fetching submissions with teams:", error);
        return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
    }
}