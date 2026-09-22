import { PRODUCT_LIST, siteUrl } from "@codeloom/config";
import type { MetadataRoute } from "next";

const routes = [
  "/",
  "/engine",
  "/engine/read-funnel",
  "/engine/write-funnel",
  "/engine/agents",
  "/engine/extend",
  "/engine/results",
  "/engine/results/codeloom-engine",
  "/engine/results/reach-auth-proxy",
  "/engine/results/tracer",
  ...PRODUCT_LIST.filter((item) => item.id !== "engine").map((item) => item.path),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((path) => ({ url: siteUrl(path), lastModified }));
}
