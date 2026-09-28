import { MOTHER_REPO } from "./links";

export type ProductId = "engine" | "cloud-controller" | "clients";

export type ProductAccent = {
  from: string;
  to: string;
  solid: string;
  glow: string;
};

export type ProductStatus = "live" | "in-development" | "concept";

export type Product = {
  id: ProductId;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  path: string;
  github: string;
  motherRepo: string;
  status: ProductStatus;
  keywords: string[];
  accent: ProductAccent;
};

const accents: Record<ProductId, ProductAccent> = {
  engine: {
    from: "#ff5c33",
    to: "#f2c14e",
    solid: "#ff5c33",
    glow: "rgba(255, 92, 51, 0.35)",
  },
  "cloud-controller": {
    from: "#38bdf8",
    to: "#818cf8",
    solid: "#38bdf8",
    glow: "rgba(56, 165, 248, 0.35)",
  },
  clients: {
    from: "#34d399",
    to: "#22d3ee",
    solid: "#34d399",
    glow: "rgba(52, 211, 153, 0.35)",
  },
};

export const PRODUCTS: Record<ProductId, Product> = {
  engine: {
    id: "engine",
    name: "CodeLoom Engine",
    shortName: "Engine",
    tagline: "A JSON-IPC Unix server. The TUI is just a client.",
    description:
      "A Python engine that owns the workspace: NDJSON over .engine/engine.sock, an orchestrator that spawns 6 subagent personas into isolated git worktrees, 32 @tool functions across ten families, a write funnel with a tree-sitter syntax gate and full undo, a TypeSafe judge layer (model jev-latest) for calibrated, typed risk checks at existing choke points, language-server support (pyright, typescript-language-server, gopls) for Python, Go, JavaScript, and TypeScript, SQLite sessions, and OpenRouter. Source-available under the Business Source License — free for development and evaluation.",
    path: "/engine",
    github: "https://github.com/iresharma/codeloom.engine",
    motherRepo: MOTHER_REPO,
    status: "live",
    keywords: [
      "coding agent backend",
      "ndjson unix socket",
      "json-ipc",
      "openrouter",
      "typesafe judge",
      "calibrated classifier",
      "tree-sitter",
      "language server protocol",
      "multi-agent orchestrator",
      "git worktree isolation",
      "business source license",
      "codeloom engine",
    ],
    accent: accents.engine,
  },
  "cloud-controller": {
    id: "cloud-controller",
    name: "CodeLoom Cloud Controller",
    shortName: "Cloud Controller",
    tagline: "Fleet control for engines running in the cloud.",
    description:
      "The control plane for unattended Engine runs — provisioning sandboxes, scheduling sessions, and supervising a fleet of cloud agents so a run doesn't need a laptop open to finish. Concept stage.",
    path: "/cloud-controller",
    github: "https://github.com/iresharma/codeloom-cloud-controller",
    motherRepo: MOTHER_REPO,
    status: "concept",
    keywords: [
      "cloud agent orchestration",
      "agent fleet management",
      "sandbox provisioning",
      "unattended coding agent",
      "codeloom cloud controller",
    ],
    accent: accents["cloud-controller"],
  },
  clients: {
    id: "clients",
    name: "CodeLoom Clients",
    shortName: "Clients",
    tagline: "Every surface that talks to the engine over one socket.",
    description:
      "Thin clients that render the engine's events. The web client runs agent sessions in cloud sandboxes through the cloud controller — sign in with GitHub, pick a repo, watch it work live and review its changes. The terminal TUI is also available. No client owns the workspace — the engine does.",
    path: "/clients",
    github: "https://github.com/iresharma/codeloom.web",
    motherRepo: MOTHER_REPO,
    status: "in-development",
    keywords: [
      "web coding agent",
      "browser coding agent",
      "cloud coding agent",
      "engine client",
      "codeloom web",
      "codeloom tui",
    ],
    accent: accents.clients,
  },
};

export const PRODUCT_LIST = Object.values(PRODUCTS);
