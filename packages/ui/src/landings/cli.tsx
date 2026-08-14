"use client";

import { ArrowRightLeft, Braces, SquareTerminal, Workflow } from "lucide-react";
import { PRODUCTS } from "@codeloom/config";

import { FeatureBento } from "../components/feature-bento";
import { Hero } from "../components/hero";
import { HowItWorks } from "../components/how-it-works";
import { LogoMarquee } from "../components/logo-marquee";
import { ProductShell } from "../components/product-shell";
import { CliMock } from "../mocks/cli-mock";

const product = PRODUCTS.cli;

export function CliLanding() {
  return (
    <ProductShell product={product}>
      <Hero product={product}>
        <CliMock />
      </Hero>
      <LogoMarquee className="py-10" />
      <FeatureBento
        eyebrow="Command line"
        title="An agent that behaves like grep"
        description="CodeLoom CLI is the boring sibling. No editor chrome. Stdin, flags, exit codes, and a patch you can pipe into git."
        features={[
          {
            Icon: SquareTerminal,
            name: "One binary",
            description: "Install it, alias it, forget the UI. It is a coding agent that looks like a Unix tool.",
            className: "md:col-span-1",
          },
          {
            Icon: ArrowRightLeft,
            name: "Pipes welcome",
            description: "Feed it a stack trace, a diff, or a test failure. Get a patch or a PR URL back.",
            className: "md:col-span-2",
            items: ["stdin", "stdout", "jq", "gh"],
          },
          {
            Icon: Workflow,
            name: "CI native",
            description: "Non-interactive mode for GitHub Actions. Fail closed. Leave a comment, not a mystery.",
            className: "md:col-span-2",
            items: ["--pr", "--json", "--dry-run", "exit 1"],
          },
          {
            Icon: Braces,
            name: "Scriptable JSON",
            description: "Every run can emit machine-readable events. Compose it with the rest of your shell.",
            className: "md:col-span-1",
          },
        ]}
      />
      <HowItWorks
        steps={[
          { title: "Invoke it", body: "codeloom fix --file src/api.ts or pipe logs into it. Same contract as any CLI." },
          { title: "It edits locally", body: "Patches land in the working tree. You still own git add." },
          { title: "Optional PR", body: "Pass --pr and it opens one. Pass nothing and it stays quiet." },
        ]}
      />
    </ProductShell>
  );
}
