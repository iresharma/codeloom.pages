import { PRODUCTS, siteUrl } from "@codeloom/config";
import { EngineResultReport, reachAuthProxyReport } from "@codeloom/ui";
import type { Metadata } from "next";

const product = PRODUCTS.engine;

export const metadata: Metadata = {
  title: `Results · ${reachAuthProxyReport.repo}`,
  description: reachAuthProxyReport.taskSummary,
  openGraph: {
    title: `${reachAuthProxyReport.repo} · ${product.name} results`,
    description: reachAuthProxyReport.taskTitle,
    url: siteUrl("/engine/results/reach-auth-proxy"),
  },
};

export default function ReachAuthProxyResultPage() {
  return <EngineResultReport report={reachAuthProxyReport} />;
}
