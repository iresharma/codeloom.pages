"use client";

import { useMemo, useState } from "react";
import {
  Boxes,
  Cable,
  Container,
  Cpu,
  Database,
  GitBranch,
  Globe,
  HardDrive,
  Network,
  Server,
} from "lucide-react";

import { FlowCanvas, FlowDetail, lane, link, step, type FlowNode } from "../components/flow";

const W = 158;
const WIDE = 248;
const L = -W - 18;
const R = 18;
const SX = 252; // right-hand store column
const GX = -432; // left-hand GitHub column

const details: Record<string, { title: string; body: string }> = {
  web: {
    title: "web client",
    body: "The browser. REST to start and manage sessions, a WebSocket to watch one run live. It renders the engine's events — it never calls a model.",
  },
  api: {
    title: "HTTP + WebSocket API",
    body: "FastAPI. /auth (GitHub OAuth), /projects (the repos you register), /sessions (start, stop, list), and /sessions/{id}/stream — the WebSocket that carries the engine's JSON both ways.",
  },
  ctl: {
    title: "cloud controller",
    body: "One process on :8000. It holds the GitHub tokens, the project and session records, and a SessionManager + SessionBridge per live run. The engine logic stays in the engine.",
  },
  mgr: {
    title: "SessionManager",
    body: "Provisions a sandbox per session, waits for the engine to report ready, and reattaches to still-running containers after a controller restart. It refreshes the GitHub grant before the sandbox starts.",
  },
  bridge: {
    title: "SessionBridge",
    body: "One engine connection, fanned out to every WebSocket on the session. Commands are relayed back to the engine; StartSession's workspace is rewritten to /workspace and unknown commands are refused.",
  },
  mem: {
    title: "MemoryStore",
    body: "Per-repo agent memory the controller owns. Seeded into the engine at StartSession and captured back from a MemoryExported event, so the next run on this repo resumes what the last one learned. Local JSON today, object storage later.",
  },
  db: {
    title: "SQLite",
    body: "Users, projects (owner/repo + runtime), and sessions (status, container, workspace, engine session id) — plus a replayable transcript archived for every ended session.",
  },
  sandbox: {
    title: "Docker sandbox",
    body: "One container per chat. The repo is cloned inside it onto the image that matches its language; /workspace is a bind mount and .engine is a tmpfs. The OpenRouter, TypeSafe and GitHub keys are injected here, never written into the clone.",
  },
  engine: {
    title: "engine session",
    body: "The same engine from the engine pages, running inside the sandbox. It owns /workspace, runs the model loop, the tools and the write funnel. The controller only starts it and relays its stream.",
  },
  proxy: {
    title: "tcp_proxy",
    body: "A Unix socket on a Docker Desktop bind mount doesn't work, so the engine's .engine/engine.sock is bridged to TCP :7422, published to a random host port the controller dials.",
  },
  gh: {
    title: "GitHub",
    body: "OAuth sign-in and the source of every clone. The token is encrypted at rest and refreshed before a run; a grant that can't be refreshed fails the session cleanly instead of dying mid-push.",
  },
};

export function CloudControllerArchitectureFlow() {
  const [selected, setSelected] = useState<string | null>("ctl");

  const { nodes, edges } = useMemo(() => {
    const nodes: FlowNode[] = [
      lane("l-client", -W / 2, -30, "your machine", W),
      step("web", -W / 2, 0, { label: "web client", sub: "REST + WebSocket", icon: Globe, width: W }),

      step("api", -WIDE / 2, 100, { label: "HTTP + WS API", sub: "/projects · /sessions · /stream", icon: Network, width: WIDE }),
      step("ctl", -WIDE / 2, 200, { label: "cloud controller", sub: "FastAPI · :8000", icon: Server, tone: "active", width: WIDE }),
      step("db", SX, 200, { label: "SQLite", sub: "users · projects · sessions", icon: Database, width: W }),

      step("mgr", L, 312, { label: "SessionManager", sub: "provision · reattach", icon: Boxes, width: W }),
      step("bridge", R, 312, { label: "SessionBridge", sub: "1 conn → N clients", icon: Cable, width: W }),
      step("mem", SX, 312, { label: "MemoryStore", sub: "per-repo · S3-ready", icon: HardDrive, tone: "success", width: W }),

      step("gh", GX, 424, { label: "GitHub", sub: "OAuth · clone · gh PRs", icon: GitBranch, width: W }),
      step("sandbox", -WIDE / 2, 424, { label: "Docker sandbox", sub: "repo cloned · .engine on tmpfs", icon: Container, width: WIDE }),

      step("engine", L, 536, { label: "engine session", sub: "owns /workspace", icon: Cpu, tone: "active", width: W }),
      step("proxy", R, 536, { label: "tcp_proxy", sub: ".sock → :7422", icon: Cable, width: W }),
    ];

    const edges = [
      link("web", "api", { label: "REST" }),
      link("api", "web", { from: "r", to: "r", dashed: true, label: "ws events", id: "events" }),
      link("api", "ctl"),
      link("ctl", "db", { from: "r", to: "l", dashed: true, label: "rows", id: "rows" }),
      link("ctl", "mgr"),
      link("ctl", "bridge"),
      link("bridge", "mem", { from: "r", to: "l", dashed: true, tone: "success", label: "memory", id: "memory" }),
      link("mgr", "sandbox", { animated: true, label: "docker run" }),
      link("gh", "sandbox", { from: "r", to: "l", dashed: true, label: "clone", id: "clone" }),
      link("sandbox", "engine"),
      link("sandbox", "proxy"),
      link("engine", "proxy", { from: "r", to: "l", label: "NDJSON" }),
      link("proxy", "bridge", { from: "r", to: "r", label: "TCP :7422", id: "tcp" }),
    ];
    return { nodes, edges };
  }, []);

  const detail = selected ? details[selected] : null;

  return (
    <div className="border border-white/10">
      <FlowCanvas
        nodes={nodes}
        edges={edges}
        selectedId={selected}
        onSelect={setSelected}
        heightClass="h-[460px] md:h-[640px]"
        ariaLabel="Cloud controller architecture: the web client reaches a FastAPI control plane that provisions one Docker sandbox per chat, clones the repo and boots an engine session, bridges the engine's protocol to the client over a WebSocket, and keeps per-repo memory, sessions and transcripts."
        hint="tap a box"
        minWidth={560}
      />
      <FlowDetail title={detail?.title} body={detail?.body} />
    </div>
  );
}
