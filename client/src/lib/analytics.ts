export type ConversionEvent =
  | "quick_link_click"
  | "featured_case_view"
  | "brief_start"
  | "brief_submit";

export function trackConversion(event: ConversionEvent, payload?: Record<string, any>) {
  try {
    const timestamp = new Date().toISOString();
    const eventData = { event, timestamp, ...(payload ?? {}) };

    // Log to console in development/preview
    console.log(`[Analytics] ${event}`, eventData);

    // Store in sessionStorage for debugging or lightweight funnel analysis
    const existing = sessionStorage.getItem("viktor.conversionEvents");
    const parsed = existing ? JSON.parse(existing) : [];
    parsed.push(eventData);
    sessionStorage.setItem("viktor.conversionEvents", JSON.stringify(parsed));

    // Optional integration hook for Vercel / custom analytics endpoints if available
    if (typeof window !== "undefined" && (window as any).va) {
      (window as any).va("track", event, payload);
    }
  } catch {
    /* ignore storage limitations */
  }
}
