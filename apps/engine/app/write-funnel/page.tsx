import { PRODUCTS } from "@codeloom/config";
import { EngineWriteFunnelLanding } from "@codeloom/ui";
import type { Metadata } from "next";

const product = PRODUCTS.engine;

export const metadata: Metadata = {
  title: "Write funnel",
  description:
    "CodeLoom Engine's write funnel: six checks — read, guard, identity, syntax, atomic write, undo — before any edit lands.",
  openGraph: {
    title: `Write funnel · ${product.name}`,
    description: "Six checks. Every write.",
    url: `https://${product.host}/write-funnel`,
  },
};

export default function WriteFunnelPage() {
  return <EngineWriteFunnelLanding />;
}
