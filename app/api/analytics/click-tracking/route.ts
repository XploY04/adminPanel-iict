import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import type { ClickTrackingRecord } from "@/types/analytics";

// GET - Get click statistics
export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<ClickTrackingRecord>("clicktrackings");

    // Get total clicks
    const totalClicks = await collection.countDocuments();

    // Get clicks by button type
    const clicksByTypeResult = await collection
      .aggregate([
        {
          $group: {
            _id: "$buttonType",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    // Get clicks by date (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const clicksByDate = await collection
      .aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ])
      .toArray();

    // Get recent clicks (last 100)
    const recentClicks = await collection
      .find(
        {},
        {
          projection: {
            buttonType: 1,
            createdAt: 1,
            ipAddress: 1,
            userAgent: 1,
          },
        }
      )
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    // Transform clicksByType to object format
    const clicksByType = clicksByTypeResult.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      totalClicks,
      clicksByType,
      clicksByDate,
      recentClicks,
    });
  } catch (error) {
    console.error("Error fetching click statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch click statistics" },
      { status: 500 }
    );
  }
}
