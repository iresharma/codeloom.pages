import { PRODUCTS, siteUrl } from "@codeloom/config";
import { codeloomEngineReport, EngineResultReport } from "@codeloom/ui";
import type { Metadata } from "next";

const product = PRODUCTS.engine;

export const metadata: Metadata = {
  title: `Results · ${codeloomEngineReport.repo}`,
  description: codeloomEngineReport.taskSummary,
  openGraph: {
    title: `${codeloomEngineReport.repo} · ${product.name} results`,
    description: codeloomEngineReport.taskTitle,
    url: siteUrl("/engine/results/codeloom-engine"),
  },
};

export default function CodeloomEngineResultPage() {
  return <EngineResultReport report={codeloomEngineReport} />;
}
