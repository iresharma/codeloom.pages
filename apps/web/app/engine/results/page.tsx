import { PRODUCTS, siteUrl } from "@codeloom/config";
import { EngineResultsIndexLanding } from "@codeloom/ui";
import type { Metadata } from "next";

const product = PRODUCTS.engine;

export const metadata: Metadata = {
  title: "Results",
  description:
    "A paired coding benchmark of CodeLoom Engine and mini-SWE-agent, with task outcomes, costs, hidden checks and downloadable evidence.",
  openGraph: {
    title: `Results · ${product.name}`,
    description:
      "Same coding tasks and model. Compare paired outcomes, cost and traces.",
    url: siteUrl("/engine/results"),
  },
};

export default function ResultsPage() {
  return <EngineResultsIndexLanding />;
}
