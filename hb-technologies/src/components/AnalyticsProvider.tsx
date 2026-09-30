"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, ReactNode } from "react";

/**
 * AnalyticsProvider Component
 *
 * Wraps the application and initializes analytics on startup.
 * Should be placed high in the component tree (near root layout).
 *
 * Features:
 * - Initializes all analytics platforms
 * - Tracks page views automatically
 * - Handles consent management
 * - Respects user privacy preferences
 *
 * Usage:
 * <AnalyticsProvider>
 *   <YourApp />
 * </AnalyticsProvider>
 */

interface AnalyticsProviderProps {
  children: ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const pathname = usePathname();
  const analyticsRef = useRef<{
    initialize: () => Promise<void>;
    trackPageView: () => void;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const loadAnalytics = async () => {
      const { getAnalyticsService } = await import("@/lib/analytics-service");
      if (cancelled) return;

      const analytics = getAnalyticsService();
      analyticsRef.current = analytics;
      await analytics.initialize();
      analytics.trackPageView();
    };

    const scheduleLoad = () => {
      timeoutId = setTimeout(() => void loadAnalytics(), 5000);
    };

    if (document.readyState === "complete") {
      scheduleLoad();
    } else {
      window.addEventListener("load", scheduleLoad, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", scheduleLoad);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (analyticsRef.current && pathname) {
      analyticsRef.current.trackPageView();
    }
  }, [pathname]);

  return <>{children}</>;
}

export default AnalyticsProvider;
