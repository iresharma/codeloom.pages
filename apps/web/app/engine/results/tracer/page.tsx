import { PRODUCTS, siteUrl } from "@codeloom/config";
import { EngineResultReport, tracerReport } from "@codeloom/ui";
import type { Metadata } from "next";

const product = PRODUCTS.engine;

export const metadata: Metadata = {
  title: `Results · ${tracerReport.repo}`,
  description: tracerReport.taskSummary,
  openGraph: {
    title: `${tracerReport.repo} · ${product.name} results`,
    description: tracerReport.taskTitle,
    url: siteUrl("/engine/results/tracer"),
  },
};

export default function TracerResultPage() {
  return <EngineResultReport report={tracerReport} />;
}
