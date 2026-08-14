"use client";

import { Braces, MessageSquare, Sparkles, SplitSquareHorizontal } from "lucide-react";
import { PRODUCTS } from "@codeloom/config";

import { FeatureBento } from "../components/feature-bento";
import { Hero } from "../components/hero";
import { HowItWorks } from "../components/how-it-works";
import { LogoMarquee } from "../components/logo-marquee";
import { ProductShell } from "../components/product-shell";
import { IdeMock } from "../mocks/ide-mock";

const product = PRODUCTS.ide;

export function IdeLanding() {
  return (
    <ProductShell product={product}>
      <Hero product={product}>
        <IdeMock />
      </Hero>
      <LogoMarquee className="py-10" />
      <FeatureBento
        eyebrow="Editor"
        title="A VS Code fork that talks back"
        description="CodeLoom IDE is a Cursor-shaped experiment: inline completions, a composer, and an agent that can touch many files without leaving the editor."
        features={[
          {
            Icon: Sparkles,
            name: "Inline completions",
            description: "Ghost text that knows the file you are in and the one next to it.",
            className: "md:col-span-1",
          },
          {
            Icon: SplitSquareHorizontal,
            name: "Composer",
            description: "Describe a change across the workspace. Watch a multi-file diff stream in.",
            className: "md:col-span-2",
            items: ["Tab", "Agent", "Ask", "Edit"],
          },
          {
            Icon: MessageSquare,
            name: "Chat with the tree",
            description: "The sidebar indexes the repo so questions hit real symbols, not vibes.",
            className: "md:col-span-2",
            items: ["Index", "Citations", "Apply", "Undo"],
          },
          {
            Icon: Braces,
            name: "Familiar bones",
            description: "Forked from VS Code. Your keybindings, extensions, and muscle memory stay.",
            className: "md:col-span-1",
          },
        ]}
      />
      <HowItWorks
        steps={[
          { title: "Open a folder", body: "Same as VS Code. The agent indexes in the background." },
          { title: "Ask or tab", body: "Inline when you are in flow. Composer when the change is bigger than a line." },
          { title: "Accept the diff", body: "Every edit is reviewable. Nothing writes the repo without you." },
        ]}
      />
    </ProductShell>
  );
}
