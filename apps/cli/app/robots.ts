import { PRODUCTS } from "@codeloom/config";
import type { MetadataRoute } from "next";

import { PRODUCT_ID } from "../product";

export default function robots(): MetadataRoute.Robots {
  const product = PRODUCTS[PRODUCT_ID];
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `https://${product.host}/sitemap.xml`,
  };
}
