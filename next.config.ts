import type { NextConfig } from "next";

const githubPages = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  ...(githubPages ? {
    output: "export",
    trailingSlash: true,
    // All UI routes/layouts are TSX. Exclude the server-only route.ts API
    // from static builds; keep it available for regular Next.js/Sites builds.
    pageExtensions: ["tsx"],
  } : {}),
};

export default nextConfig;
