import { PRODUCTS, siteUrl } from "@codeloom/config";
import { ClientsLanding } from "@codeloom/ui";
import type { Metadata } from "next";

const product = PRODUCTS.clients;

export const metadata: Metadata = {
  title: product.shortName,
  description: product.description,
  openGraph: {
    title: product.name,
    description: product.tagline,
    url: siteUrl(product.path),
  },
};

export default function ClientsPage() {
  return <ClientsLanding />;
}
