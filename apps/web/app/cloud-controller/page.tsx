import { PRODUCTS, siteUrl } from "@codeloom/config";
import { CloudControllerLanding } from "@codeloom/ui";
import type { Metadata } from "next";

const product = PRODUCTS["cloud-controller"];

export const metadata: Metadata = {
  title: product.shortName,
  description: product.description,
  openGraph: {
    title: product.name,
    description: product.tagline,
    url: siteUrl(product.path),
  },
};

export default function CloudControllerPage() {
  return <CloudControllerLanding />;
}
