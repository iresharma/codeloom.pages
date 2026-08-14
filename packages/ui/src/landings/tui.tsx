"use client";

import { FileSearch, FolderTree, Keyboard, TerminalSquare } from "lucide-react";
import { PRODUCTS } from "@codeloom/config";

import { FeatureBento } from "../components/feature-bento";
import { Hero } from "../components/hero";
import { HowItWorks } from "../components/how-it-works";
import { LogoMarquee } from "../components/logo-marquee";
import { ProductShell } from "../components/product-shell";
import { TuiMock } from "../mocks/tui-mock";

const product = PRODUCTS.tui;

export function TuiLanding() {
  return (
    <ProductShell product={product}>
      <Hero product={product}>
        <TuiMock />
      </Hero>
      <LogoMarquee className="py-10" />
      <FeatureBento
        eyebrow="Terminal UI"
        title="Claude Code energy. A real workspace."
        description="CodeLoom TUI is an agent you run in the terminal, with a Neovim-like file explorer and a file viewer so you can see what it is about to touch."
        features={[
          {
            Icon: FolderTree,
            name: "Netrw-shaped explorer",
            description: "hjkl through the tree. The agent and the viewer share the same cursor.",
            className: "md:col-span-2",
            items: ["hjkl", "netrw", "buffers", "splits"],
          },
          {
            Icon: FileSearch,
            name: "File viewer",
            description: "Read the file without spawning $EDITOR. Syntax, line numbers, and a statusline.",
            className: "md:col-span-1",
          },
          {
            Icon: TerminalSquare,
            name: "Agent pane",
            description: "A persistent chat that can patch, run, and report without stealing the explorer.",
            className: "md:col-span-1",
          },
          {
            Icon: Keyboard,
            name: "Keys first",
            description: "Modal by default. Mouse optional. Designed for people who already live in tmux.",
            className: "md:col-span-2",
            items: [":CodeLoom", "leader-a", "ctrl-w", "ZZ"],
          },
        ]}
      />
      <HowItWorks
        steps={[
          { title: "Drop into a repo", body: "codeloom-tui . opens explorer, viewer, and agent in one frame." },
          { title: "Point at a file", body: "Move the tree. The viewer follows. The agent already has context." },
          { title: "Let it patch", body: "Review in the viewer, keep your fingers on the home row." },
        ]}
      />
    </ProductShell>
  );
}
