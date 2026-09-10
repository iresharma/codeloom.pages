import { PRODUCTS } from "@codeloom/config";
import { EngineExtendLanding } from "@codeloom/ui";
import type { Metadata } from "next";

const product = PRODUCTS.engine;

export const metadata: Metadata = {
  title: "Extend",
  description:
    "How to extend CodeLoom Engine on every front: a new tool, a new command or event, a new subagent, a new transport, a new model — each one file and a restart.",
  openGraph: {
    title: `Extend · ${product.name}`,
    description: "Five surfaces. One rule.",
    url: `https://${product.host}/extend`,
  },
};

export default function ExtendPage() {
  return <EngineExtendLanding />;
}
