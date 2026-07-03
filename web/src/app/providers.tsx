"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "@posthog/react";

// Module-level guard so React strict-mode's double mount does not double-init.
let initialised = false;

export function PHProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (initialised) return;
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return; // Unconfigured (e.g. local dev without the key): stay a no-op.
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com",
      defaults: "2026-05-30",
      // Cookieless: no cookies or localStorage, so the site needs no consent banner.
      // Trade-off: identity is per-session (a returning visitor is a new anonymous id).
      persistence: "memory",
      person_profiles: "identified_only",
      // Keep collection minimal to match the privacy notice: explicit funnel
      // events only, no session replay or surveys.
      autocapture: false,
      disable_session_recording: true,
      disable_surveys: true,
    });
    initialised = true;
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
