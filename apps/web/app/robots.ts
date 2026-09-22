import { SITE_HOST } from "@codeloom/config";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `https://${SITE_HOST}/sitemap.xml`,
  };
}
