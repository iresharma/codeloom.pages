import type { Metadata } from "next";
import { PRODUCTS } from "@codeloom/config";
import { IdeLanding } from "@codeloom/ui";

const product = PRODUCTS.ide;

export const metadata: Metadata = {
  title: `${product.name} — ${product.tagline}`,
  description: product.description,
  keywords: product.keywords,
  openGraph: {
    title: product.name,
    description: product.description,
    url: `https://${product.host}`,
  },
};

export default function Page() {
  return <IdeLanding />;
}
