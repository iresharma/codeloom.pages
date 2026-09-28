"use client";

import { useMemo, useState } from "react";
import { Bot, Cable, Cpu, FolderGit2, Gavel, Globe, ShieldCheck, SquareTerminal, TerminalSquare, Wrench } from "lucide-react";

import { FlowCanvas, FlowDetail, lane, link, step, type FlowNode } from "../components/flow";

const W = 150;

const details: Record<string, { title: string; body: string }> = {
  tui: { title: "TUI", body: "The TUI client, along with other clients including a web client, renders what the engine says and sends commands back." },
  web: { title: "web client", body: "Same protocol, same events. No engine logic lives in a client." },
  repl: { title: "REPL · dummy_client.py", body: "A plain REPL over the socket — the smallest possible client." },
  sock: {
    title: ".engine/engine.sock",
    body: "Newline-delimited JSON over one Unix socket: 12 commands in, 27 events out. Every client sees the same stream.",
  },
  engine: {
    title: "engine session",
    body: "A Python process that owns the workspace. It runs the model loop, the tools, and the write funnel.",
  },
  loop: { title: "model loop", body: "An OpenRouter loop. The model returns tool calls, the engine runs them and calls again." },
  tools: { title: "32 tools", body: "Ten families — navigation, tree-sitter, language servers, editing, git, web, browser. Each one is a file." },
  orch: {
    title: "orchestrator",
    body: "Spawns six subagent personas; writers get their own git worktree. It has no filesystem tools of its own.",
  },
  judge: {
    title: "TypeSafe judge",
    body: "A ~100ms calibrated classifier (jev-latest) at the write funnel and the shell gate. It can only add restriction, never relax a guard.",
  },
  funnel: { title: "write funnel", body: "Six checks before any write lands: read, guard, id, syntax, atomic write, undo journal." },
  ws: { title: "workspace", body: "Your files, the writers' git worktrees, and SQLite sessions that survive a restart." },
};

export function EngineArchitectureFlow() {
  const [selected, setSelected] = useState<string | null>("engine");

  const { nodes, edges } = useMemo(() => {
    // Two columns, so the whole graph stays readable at phone width.
    const L = -W - 15;
    const R = 15;
    const C = 100;
    const nodes: FlowNode[] = [
      lane("l-clients", -W / 2, -30, "clients", W),
      step("tui", -165, 0, { label: "TUI", icon: SquareTerminal, width: C }),
      step("web", -50, 0, { label: "web", icon: Globe, width: C }),
      step("repl", 65, 0, { label: "REPL", icon: TerminalSquare, width: C }),
      step("sock", -120, 96, { label: "engine.sock", sub: "NDJSON · 12 in / 27 out", icon: Cable, width: 240 }),
      step("engine", -120, 196, { label: "engine session", sub: "owns the workspace", icon: Cpu, tone: "accent", width: 240 }),
      step("orch", L, 306, { label: "orchestrator", sub: "6 personas", width: W }),
      step("loop", R, 306, { label: "model loop", icon: Bot, width: W }),
      step("judge", L, 406, { label: "TypeSafe judge", icon: Gavel, width: W }),
      step("tools", R, 406, { label: "32 tools", icon: Wrench, width: W }),
      step("funnel", R, 506, { label: "write funnel", sub: "six checks", icon: ShieldCheck, tone: "active", width: W }),
      step("ws", -120, 616, { label: "workspace", sub: "files · worktrees · SQLite", icon: FolderGit2, width: 240 }),
    ];
    const edges = [
      link("tui", "sock", { label: "commands" }),
      link("web", "sock"),
      link("repl", "sock"),
      link("sock", "engine"),
      link("engine", "sock", { from: "r", to: "r", label: "events", dashed: true, id: "events" }),
      link("engine", "orch"),
      link("engine", "loop"),
      link("loop", "tools", { label: "tool calls" }),
      link("tools", "funnel", { label: "writes", tone: "accent", animated: true }),
      link("judge", "funnel", { from: "b", to: "l", dashed: true, label: "judges" }),
      link("funnel", "ws", { tone: "accent" }),
      link("orch", "ws", { from: "l", to: "l", dashed: true, label: "worktrees", id: "worktrees" }),
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
        heightClass="h-[480px] md:h-[780px]"
        ariaLabel="Engine architecture: clients speak NDJSON over a Unix socket to one engine session, which runs the model loop, tools, orchestrator and judge; writes pass the write funnel into the workspace."
        hint="tap a box"
        minWidth={340}
      />
      <FlowDetail title={detail?.title} body={detail?.body} />
    </div>
  );
}
