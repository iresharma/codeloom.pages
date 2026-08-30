import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  transpilePackages: ["@codeloom/ui", "@codeloom/config"],
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, "../.."),
};

export default nextConfig;
