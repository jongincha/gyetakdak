"use client";

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** Fires the same event to GA4/GTM dataLayer and Meta Pixel when present. No-ops safely if scripts aren't loaded (e.g. local dev without env keys). */
export function trackEvent(eventName: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: eventName, ...params });

  window.gtag?.("event", eventName, params);
  window.fbq?.("trackCustom", eventName, params);
}
