export interface ClickTrackingRecord {
  _id?: string;
  buttonType:
    | "hero_register"
    | "navbar_register_desktop"
    | "navbar_register_mobile";
  userAgent: string;
  ipAddress: string;
  timestamp: Date;
  referrer: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClickAnalytics {
  totalClicks: number;
  clicksByType: Record<string, number>;
  clicksByDate: Array<{ _id: string; count: number }>;
  recentClicks: Array<{
    _id: string;
    buttonType: string;
    createdAt: string;
    ipAddress: string;
    userAgent: string;
  }>;
}
