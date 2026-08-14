import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@codeloom/ui", "@codeloom/config"],
  reactStrictMode: true,
};

export default nextConfig;
