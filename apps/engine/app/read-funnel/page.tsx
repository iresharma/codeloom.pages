import { PRODUCTS } from "@codeloom/config";
import { EngineReadFunnelLanding } from "@codeloom/ui";
import type { Metadata } from "next";

const product = PRODUCTS.engine;

export const metadata: Metadata = {
  title: "Read funnel",
  description:
    "CodeLoom Engine reads code cheapest-first: grep, then tree-sitter, then a real language server — never guessing with just one.",
  openGraph: {
    title: `Read funnel · ${product.name}`,
    description: "The cheapest tool that answers, every time.",
    url: `https://${product.host}/read-funnel`,
  },
};

export default function ReadFunnelPage() {
  return <EngineReadFunnelLanding />;
}
