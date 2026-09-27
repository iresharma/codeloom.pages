"use client";

import { useMemo, useState } from "react";
import { GitBranch, Route, UserRound } from "lucide-react";

import { FlowCanvas, FlowDetail, lane, link, step, type FlowNode } from "../components/flow";
import { personas, settleChoices } from "../landings/engine/data";

// Two columns, so the whole graph stays readable at phone width.
const W = 150;
const L = -W - 15;
const R = 15;
const MID = -W / 2;

const persona = (name: string) => personas.find((p) => p.name === name);
const readers = ["ask", "researcher", "debugger"] as const;

export function EngineAgentsFlow() {
  const [selected, setSelected] = useState<string | null>("coder");

  const { nodes, edges } = useMemo(() => {
    const nodes: FlowNode[] = [
      step("you", MID, 0, { label: "you", icon: UserRound, width: W }),
      step("orch", MID - 20, 92, { label: "orchestrator", sub: "spawn calls only", icon: Route, tone: "accent", width: W + 40 }),
      lane("l-main", L, 184, "main checkout", W),
      ...readers.map((name, i) =>
        step(name, L, 210 + i * 76, { label: name, sub: persona(name)?.role, width: W }),
      ),
      lane("l-wt", R, 184, "own worktree", W),
      step("coder", R, 210, { label: "coder", sub: "writes", tone: "active", width: W }),
      step("reviewer", R, 300, { label: "reviewer", sub: "joins coder's tree", width: W }),
      step("tester", R, 390, { label: "tester", sub: "joins coder's tree", width: W }),
      step("settle", MID, 490, { label: "you settle", sub: "nothing lands without you", icon: GitBranch, tone: "warn", width: W }),
      ...settleChoices.map((choice, i) =>
        step(`s-${choice.id}`, i % 2 === 0 ? L : R, 596 + Math.floor(i / 2) * 62, {
          label: choice.label,
          tone: choice.id === "discard" ? "ghost" : "default",
          width: W,
        }),
      ),
    ];
    const edges = [
      link("you", "orch", { label: "request" }),
      ...readers.map((name) => link("orch", name, { from: "l", to: "l" })),
      link("orch", "coder", { label: "spawn + brief", tone: "accent" }),
      link("coder", "tester", { from: "r", to: "r", animated: true }),
      link("coder", "reviewer", { label: "auto-verify", animated: true }),
      link("tester", "settle"),
      link("reviewer", "settle", { from: "l", to: "t", id: "reviewer->settle" }),
      ...settleChoices.map((choice) => link("settle", `s-${choice.id}`, { tone: choice.id === "discard" ? "muted" : "default" })),
    ];
    return { nodes, edges };
  }, []);

  const detail = (() => {
    if (!selected) return null;
    if (selected === "you") return { title: "you", body: "You ask once. You get one question back when a writer finishes: what to do with its branch." };
    if (selected === "orch")
      return {
        title: "orchestrator",
        body: "It has no filesystem tools of its own — just spawn calls. Each child's transcript comes back folded into one report; none of its raw tokens reach the chat.",
      };
    if (selected === "settle")
      return {
        title: "settle",
        body: "When a coder finishes, the engine starts the tester and reviewer on that same worktree and holds the settle until both report. Then you choose.",
      };
    if (selected.startsWith("s-")) {
      const choice = settleChoices.find((c) => `s-${c.id}` === selected);
      return choice ? { title: choice.label, body: choice.body } : null;
    }
    const p = persona(selected);
    return p ? { title: `${p.name} · ${p.worktree}`, body: p.body } : null;
  })();

  return (
    <div className="border border-white/10">
      <FlowCanvas
        nodes={nodes}
        edges={edges}
        selectedId={selected}
        onSelect={setSelected}
        heightClass="h-[600px] md:h-[780px]"
        ariaLabel="How a request moves: you ask the orchestrator, which spawns ask, researcher, debugger on the main checkout or a coder in its own worktree; tester and reviewer join that worktree; then you settle with merge, open a PR, keep, or discard."
        hint="tap a persona"
        minWidth={340}
      />
      <FlowDetail title={detail?.title} body={detail?.body} />
    </div>
  );
}
