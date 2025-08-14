import type { ButtonType, ClickTrackingData } from "@/types/analytics";

/**
 * Utility function to track register button clicks
 */
export async function trackClick(buttonType: ButtonType): Promise<void> {
  try {
    const trackingData: ClickTrackingData = {
      buttonType,
      userAgent: navigator.userAgent,
      referrer: document.referrer || "",
    };

    await fetch("/api/analytics/click-tracking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(trackingData),
    });
  } catch (error) {
    // Silently fail to avoid disrupting user experience
    console.warn("Failed to track click:", error);
  }
}

/**
 * Hook for React components to track clicks
 */
export function useClickTracking() {
  const track = async (buttonType: ButtonType) => {
    await trackClick(buttonType);
  };

  return { track };
}
