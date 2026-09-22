import { PRODUCTS, siteUrl } from "@codeloom/config";
import { EngineOverviewLanding } from "@codeloom/ui";
import type { Metadata } from "next";

const product = PRODUCTS.engine;

export const metadata: Metadata = {
  title: "Engine",
  description: product.description,
  openGraph: {
    title: product.name,
    description: product.tagline,
    url: siteUrl(product.path),
  },
};

export default function Page() {
  return <EngineOverviewLanding />;
}
