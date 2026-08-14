import { PRODUCT_LIST } from "@codeloom/config";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return PRODUCT_LIST.map((product) => ({
    url: `https://codeloom.iresharma.com${product.path === "/" ? "" : product.path}`,
    lastModified: new Date(),
  }));
}
