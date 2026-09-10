import { PRODUCTS } from "@codeloom/config";
import { EngineAgentsLanding } from "@codeloom/ui";
import type { Metadata } from "next";

const product = PRODUCTS.engine;

export const metadata: Metadata = {
  title: "Agents",
  description:
    "CodeLoom Engine's orchestrator spawns six named subagents — ask, coder, tester, researcher, debugger, reviewer — into isolated git worktrees, then asks you to merge, PR, keep, or discard.",
  openGraph: {
    title: `Agents · ${product.name}`,
    description: "An orchestrator that spawns. Workers that isolate.",
    url: `https://${product.host}/agents`,
  },
};

export default function AgentsPage() {
  return <EngineAgentsLanding />;
}
