import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@codeloom/ui", "@codeloom/config"],
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, "../.."),
  async rewrites() {
    const monitor = process.env.BENCHMARK_MONITOR_URL ?? "https://benchmark-monitor-production.up.railway.app";
    return [
      { source: "/benchmarks/railway-v1/:path*", destination: `${monitor}/benchmarks/railway-v1/:path*` },
      { source: "/benchmarks/railway-calibration/:path*", destination: `${monitor}/benchmarks/railway-calibration/:path*` },
    ];
  },
};

export default nextConfig;
