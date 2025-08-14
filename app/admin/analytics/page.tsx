"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, MousePointer, Calendar, Clock } from "lucide-react";
import type { ClickAnalytics } from "@/types/analytics";

const buttonTypeLabels: Record<string, string> = {
  hero_register: "Hero Register Button",
  navbar_register_desktop: "Navbar Register (Desktop)",
  navbar_register_mobile: "Navbar Register (Mobile)",
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<ClickAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/analytics/click-tracking");
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch analytics"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const truncateUserAgent = (userAgent: string, maxLength: number = 50) => {
    return userAgent.length > maxLength
      ? `${userAgent.substring(0, maxLength)}...`
      : userAgent;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track register button click performance
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="space-y-0 pb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Error Loading Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{error}</p>
              <button
                onClick={fetchAnalytics}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Retry
              </button>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            View register button click data and performance metrics
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Clicks
              </CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.totalClicks || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hero Button</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.clicksByType?.hero_register || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Desktop Navbar
              </CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.clicksByType?.navbar_register_desktop || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Mobile Navbar
              </CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.clicksByType?.navbar_register_mobile || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Clicks by Date */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Clicks by Date (Last 30 Days)
              </CardTitle>
              <CardDescription>Daily click distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics?.clicksByDate &&
                analytics.clicksByDate.length > 0 ? (
                  analytics.clicksByDate.map((day) => (
                    <div
                      key={day._id}
                      className="flex justify-between items-center py-2 border-b border-border last:border-b-0"
                    >
                      <span className="text-sm text-muted-foreground">
                        {formatDate(day._id)}
                      </span>
                      <Badge variant="secondary">{day.count} clicks</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No data available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Clicks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Clicks
              </CardTitle>
              <CardDescription>Last 10 register button clicks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics?.recentClicks &&
                analytics.recentClicks.length > 0 ? (
                  analytics.recentClicks.slice(0, 10).map((click) => (
                    <div key={click._id} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline">
                          {buttonTypeLabels[click.buttonType] ||
                            click.buttonType}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(click.createdAt)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>IP: {click.ipAddress}</div>
                        <div title={click.userAgent}>
                          UA: {truncateUserAgent(click.userAgent)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No clicks recorded yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Button Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Button Performance Summary</CardTitle>
            <CardDescription>
              Click distribution across different register buttons
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {Object.entries(analytics?.clicksByType || {}).map(
                ([buttonType, count]) => (
                  <div key={buttonType} className="p-4 bg-muted/50 rounded-lg">
                    <div className="text-lg font-semibold">{count}</div>
                    <div className="text-sm text-muted-foreground">
                      {buttonTypeLabels[buttonType] || buttonType}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {analytics?.totalClicks
                        ? `${((count / analytics.totalClicks) * 100).toFixed(
                            1
                          )}% of total`
                        : "0% of total"}
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
