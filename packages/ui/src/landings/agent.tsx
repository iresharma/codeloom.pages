"use client";

import {
  Bot,
  GitPullRequest,
  Shield,
  Workflow,
} from "lucide-react";
import { PRODUCTS } from "@codeloom/config";

import { FeatureBento } from "../components/feature-bento";
import { Hero } from "../components/hero";
import { HowItWorks } from "../components/how-it-works";
import { LogoMarquee } from "../components/logo-marquee";
import { ProductShell } from "../components/product-shell";
import { AgentMock } from "../mocks/agent-mock";

const product = PRODUCTS.agent;

export function AgentLanding() {
  return (
    <ProductShell product={product}>
      <Hero product={product}>
        <AgentMock />
      </Hero>
      <LogoMarquee className="py-10" />
      <FeatureBento
        eyebrow="Capabilities"
        title="Give it a ticket. Get a pull request."
        description="CodeLoom is a Devin-style autonomous agent: it reads the repo, plans, edits, runs tests, and opens a PR. Educational, open, and still very coming soon."
        features={[
          {
            Icon: Workflow,
            name: "Plan then act",
            description: "Breaks a messy request into files, tests, and a sequence it can actually execute.",
            className: "md:col-span-2",
            items: ["Explore", "Patch", "Test", "PR"],
          },
          {
            Icon: Shield,
            name: "Sandboxed runs",
            description: "Commands stay in a disposable environment. Your laptop is not the blast radius.",
            className: "md:col-span-1",
          },
          {
            Icon: Bot,
            name: "Long-running jobs",
            description: "It keeps going after you close the tab. Come back to a branch, not a half-typed chat.",
            className: "md:col-span-1",
          },
          {
            Icon: GitPullRequest,
            name: "Ships as a PR",
            description: "The artifact is git. Review it like any other human-shaped contribution.",
            className: "md:col-span-2",
            items: ["Diff", "Checks", "Comments", "Merge"],
          },
        ]}
      />
      <HowItWorks
        steps={[
          { title: "Describe the work", body: "A GitHub issue, a sentence, or a failing log. The agent turns it into a plan." },
          { title: "It lives in the repo", body: "Reads, searches, edits, and runs tests until the suite is green — or it tells you why not." },
          { title: "You review the PR", body: "Nothing merges itself. You keep the merge button. The agent keeps the night shift." },
        ]}
      />
    </ProductShell>
  );
}
