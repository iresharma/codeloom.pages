import { PRODUCTS } from "@codeloom/config";
import type { MetadataRoute } from "next";

import { PRODUCT_ID } from "../product";

export default function sitemap(): MetadataRoute.Sitemap {
  const product = PRODUCTS[PRODUCT_ID];
  return [
    {
      url: `https://${product.host}`,
      lastModified: new Date(),
    },
  ];
}
