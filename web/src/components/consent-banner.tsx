"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";

const STORAGE_KEY = "analytics-consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function updateConsent(granted: boolean) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });
}

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "granted") {
      updateConsent(true);
      return;
    }
    if (stored === "denied") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot read of external localStorage on mount, not a render loop
    setVisible(true);
  }, []);

  function choose(granted: boolean) {
    window.localStorage.setItem(STORAGE_KEY, granted ? "granted" : "denied");
    if (granted) updateConsent(true);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-panel px-4 py-4 shadow-[0_-8px_24px_-16px_rgba(22,24,29,0.35)] sm:px-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13.5px] text-ink2">We use analytics cookies to improve the site.</p>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={() => choose(false)}>
            Decline
          </Button>
          <Button variant="primary" size="sm" onClick={() => choose(true)}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
