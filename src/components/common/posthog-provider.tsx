// app/providers.tsx
"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";
import { env } from "~/env";
import SuspendedPostHogPageView from "./posthog-page-view";

export function PHProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (env.NEXT_PUBLIC_POSTHOG_API_KEY) {
      posthog.init(env.NEXT_PUBLIC_POSTHOG_API_KEY, {
        api_host: env.NEXT_PUBLIC_SITE_URL + "/ingest",
        ui_host: "https://app.posthog.com",
        person_profiles: "identified_only",
        capture_pageview: false, // Disable automatic pageview capture, as we capture manually
        autocapture: {
          css_selector_allowlist: ["[ph-autocapture]"],
        },
      });
    }
  }, []);

  return env.NEXT_PUBLIC_POSTHOG_API_KEY ? (
    <PostHogProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PostHogProvider>
  ) : (
    children
  );
}
