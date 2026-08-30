import { MOTHER_REPO } from "./links";
import { productUrl } from "./site";

export type ProductId = "agent" | "ide" | "tui" | "cli" | "engine";

export type ProductAccent = {
  from: string;
  to: string;
  solid: string;
  glow: string;
  name: string;
};

export type Product = {
  id: ProductId;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  host: string;
  path: string;
  href: string;
  github: string;
  motherRepo: string;
  comingSoon: boolean;
  keywords: string[];
  accent: ProductAccent;
};

const accents: Record<ProductId, ProductAccent> = {
  agent: {
    name: "amber",
    from: "#ffaa40",
    to: "#9c40ff",
    solid: "#f59e0b",
    glow: "rgba(245, 158, 11, 0.35)",
  },
  ide: {
    name: "violet",
    from: "#a78bfa",
    to: "#22d3ee",
    solid: "#8b5cf6",
    glow: "rgba(139, 92, 246, 0.35)",
  },
  tui: {
    name: "emerald",
    from: "#34d399",
    to: "#22d3ee",
    solid: "#10b981",
    glow: "rgba(16, 185, 129, 0.35)",
  },
  cli: {
    name: "sky",
    from: "#38bdf8",
    to: "#818cf8",
    solid: "#0ea5e9",
    glow: "rgba(14, 165, 233, 0.35)",
  },
  engine: {
    name: "infrared",
    from: "#ff5c33",
    to: "#f2c14e",
    solid: "#ff5c33",
    glow: "rgba(255, 92, 51, 0.35)",
  },
};

export const PRODUCTS: Record<ProductId, Product> = {
  agent: {
    id: "agent",
    name: "CodeLoom",
    shortName: "Agent",
    tagline: "An autonomous coding agent that plans, writes, and ships.",
    description:
      "A Devin-style agent that takes a task, explores the repo, writes code, runs it, and opens a pull request. Built in the open as a learning project.",
    host: "codeloom.iresharma.com",
    path: "/",
    href: productUrl("codeloom.iresharma.com"),
    github: "https://github.com/iresharma/codeloom-agent",
    motherRepo: MOTHER_REPO,
    comingSoon: true,
    keywords: [
      "autonomous coding agent",
      "devin",
      "ai software engineer",
      "codeloom",
    ],
    accent: accents.agent,
  },
  ide: {
    id: "ide",
    name: "CodeLoom IDE",
    shortName: "IDE",
    tagline: "An AI-native editor. Cursor energy, built from a VS Code fork.",
    description:
      "Inline completions, agent mode, and a composer that understands your whole workspace. A VS Code fork made for talking to code.",
    host: "ide.codeloom.iresharma.com",
    path: "/",
    href: productUrl("ide.codeloom.iresharma.com"),
    github: "https://github.com/iresharma/codeloom-ide",
    motherRepo: MOTHER_REPO,
    comingSoon: true,
    keywords: ["ai ide", "vscode fork", "cursor", "codeloom ide"],
    accent: accents.ide,
  },
  tui: {
    id: "tui",
    name: "CodeLoom TUI",
    shortName: "TUI",
    tagline: "A coding agent in the terminal, with a Neovim-like workspace.",
    description:
      "Claude Code vibes plus a real file explorer and file viewer. Stay in the terminal, see the tree, read the file, let the agent work.",
    host: "tui.codeloom.iresharma.com",
    path: "/",
    href: productUrl("tui.codeloom.iresharma.com"),
    github: "https://github.com/iresharma/codeloom-tui",
    motherRepo: MOTHER_REPO,
    comingSoon: true,
    keywords: ["tui coding agent", "claude code", "neovim", "terminal agent"],
    accent: accents.tui,
  },
  cli: {
    id: "cli",
    name: "CodeLoom CLI",
    shortName: "CLI",
    tagline: "A coding agent you invoke like any other Unix tool.",
    description:
      "Pipe a stack trace in, get a patch out. Scriptable, CI-friendly, and boring in the best way. No TUI required.",
    host: "cli.codeloom.iresharma.com",
    path: "/",
    href: productUrl("cli.codeloom.iresharma.com"),
    github: "https://github.com/iresharma/codeloom-cli",
    motherRepo: MOTHER_REPO,
    comingSoon: true,
    keywords: ["cli coding agent", "ai cli", "codeloom cli"],
    accent: accents.cli,
  },
  engine: {
    id: "engine",
    name: "CodeLoom Engine",
    shortName: "Engine",
    tagline: "A drop-in NDJSON Unix server for coding-agent workplaces.",
    description:
      "The local backend that manages sessions, wraps OpenRouter, and implements FileOps, Git, directory, and base tools — so the client you build can stay thin. Highly extendable. Still in development, and missing a lot.",
    host: "engine.codeloom.iresharma.com",
    path: "/",
    href: productUrl("engine.codeloom.iresharma.com"),
    github: "https://github.com/iresharma/codeloom-engine",
    motherRepo: MOTHER_REPO,
    comingSoon: true,
    keywords: [
      "coding agent backend",
      "ndjson unix socket",
      "openrouter",
      "context folding",
      "orchestrator subagents",
      "codeloom engine",
    ],
    accent: accents.engine,
  },
};

export const PRODUCT_LIST = Object.values(PRODUCTS);

export const HOST_TO_PRODUCT: Record<string, ProductId> = {
  "codeloom.iresharma.com": "agent",
  "ide.codeloom.iresharma.com": "ide",
  "tui.codeloom.iresharma.com": "tui",
  "cli.codeloom.iresharma.com": "cli",
  "engine.codeloom.iresharma.com": "engine",
};

export function productByHost(host: string | null): ProductId | null {
  if (!host) return null;
  const hostname = host.split(":")[0]?.toLowerCase();
  return HOST_TO_PRODUCT[hostname] ?? null;
}
