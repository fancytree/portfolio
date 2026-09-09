import posthog from "posthog-js";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!projectToken || !posthogHost) {
  if (process.env.NODE_ENV === "development") {
    const missingVariable = projectToken
      ? "NEXT_PUBLIC_POSTHOG_HOST"
      : "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN";

    console.error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
} else {
  // 同域 /hzn 代理事件；ui_host 指向 PostHog 控制台所在区域
  posthog.init(projectToken, {
    api_host: "/hzn",
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_UI_HOST || "https://eu.posthog.com",
    defaults: "2026-05-30",
    capture_exceptions: true,
    person_profiles: "identified_only",
  });

  posthog.register({ app: "portfolio-site" });
  posthog.capture("portfolio_site_loaded");
}
