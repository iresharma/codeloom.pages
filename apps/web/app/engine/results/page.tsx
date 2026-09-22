import { PRODUCTS, siteUrl } from "@codeloom/config";
import { EngineResultsIndexLanding } from "@codeloom/ui";
import type { Metadata } from "next";

const product = PRODUCTS.engine;

export const metadata: Metadata = {
  title: "Results",
  description:
    "Three real GitHub tickets run through CodeLoom Engine unattended, each with an independent code quality review and process review of the full agent trace.",
  openGraph: {
    title: `Results · ${product.name}`,
    description: "Three real PRs, reviewed end to end.",
    url: siteUrl("/engine/results"),
  },
};

export default function ResultsPage() {
  return <EngineResultsIndexLanding />;
}
