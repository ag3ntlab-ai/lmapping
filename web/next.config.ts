import type { NextConfig } from "next";
import path from "node:path";

// Static-friendly CSP. 'unsafe-inline' covers Next's inline hydration scripts
// without a nonce, which would opt the whole site into dynamic rendering and
// lose the static/CDN caching this marketing page depends on. There is no
// reflected user input here, so that trade is the right one; the nonce upgrade
// path stays open if the threat model ever changes. Third-party origins are
// limited to PostHog (EU); Vercel Analytics is same-origin ('self').
//
// 'unsafe-eval' is dev-only: Turbopack and React Fast Refresh need it, the
// production bundle does not. Everything else is identical across environments.
const isDev = process.env.NODE_ENV !== "production";
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://eu-assets.i.posthog.com`,
  "connect-src 'self' https://eu.i.posthog.com https://eu-assets.i.posthog.com",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  // Pin the workspace root to this app (a stray lockfile in $HOME otherwise
  // makes Next infer the wrong root).
  turbopack: {
    root: path.join(__dirname),
  },
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      // Keep the API out of search indexes (belt to robots.txt).
      { source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] },
    ];
  },
};

export default nextConfig;
