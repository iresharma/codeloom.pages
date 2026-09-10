import { PRODUCTS } from "@codeloom/config";
import type { MetadataRoute } from "next";

import { PRODUCT_ID } from "../product";

export default function sitemap(): MetadataRoute.Sitemap {
  const product = PRODUCTS[PRODUCT_ID];
  const lastModified = new Date();
  return [
    { url: `https://${product.host}`, lastModified },
    { url: `https://${product.host}/read-funnel`, lastModified },
    { url: `https://${product.host}/write-funnel`, lastModified },
    { url: `https://${product.host}/agents`, lastModified },
    { url: `https://${product.host}/extend`, lastModified },
  ];
}
