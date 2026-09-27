"use client";

import { useMemo, useState, type ReactNode } from "react";
import { GitPullRequest, Route } from "lucide-react";
import type { Edge } from "@xyflow/react";

import { FlowCanvas, FlowDetail, link, step, type FlowNode, type FlowTone } from "../../../components/flow";
import type { EngineResultReport, FlowPhase } from "./types";

const READERS = new Set(["ask", "researcher", "debugger"]);
const VERIFIERS = new Set(["tester", "reviewer"]);

const NODE_W = 150;
const GAP_X = 30;
const ROW_H = 100;

type Rank = { kind: "readers" | "coder" | "verify" | "other"; phases: { phase: FlowPhase; id: string }[] };

/** Consecutive readers share a row, as do the tester/reviewer pair a coder's finish starts. */
function rank(phases: FlowPhase[]): Rank[] {
  const ranks: Rank[] = [];
  phases.forEach((phase, i) => {
    const id = `p${i}`;
    const kind: Rank["kind"] = READERS.has(phase.profile)
      ? "readers"
      : VERIFIERS.has(phase.profile)
        ? "verify"
        : phase.profile === "coder"
          ? "coder"
          : "other";
    const last = ranks[ranks.length - 1];
    if (last && last.kind === kind && (kind === "readers" || kind === "verify")) {
      last.phases.push({ phase, id });
    } else {
      ranks.push({ kind, phases: [{ phase, id }] });
    }
  });
  return ranks;
}

function toneFor(phase: FlowPhase): FlowTone {
  if (phase.status === "failed" || phase.status === "error") return "danger";
  if (phase.status && phase.status !== "ok") return "warn";
  return "default";
}

function rowX(count: number) {
  const width = count * NODE_W + (count - 1) * GAP_X;
  return (i: number) => -width / 2 + i * (NODE_W + GAP_X);
}

export function DecisionFlowGraph({
  report,
  renderPhase,
}: {
  report: EngineResultReport;
  renderPhase: (phase: FlowPhase) => ReactNode;
}) {
  const ranks = useMemo(() => rank(report.decisionFlow.phases), [report]);
  const firstCoder = ranks.flatMap((r) => r.phases).find((p) => p.phase.profile === "coder")?.id ?? null;
  const [selected, setSelected] = useState<string | null>(firstCoder);

  const { nodes, edges } = useMemo(() => {
    const nodes: FlowNode[] = [
      step("orch", -NODE_W / 2, 0, { label: "orchestrator", sub: "routes the task", icon: Route, tone: "accent", width: NODE_W }),
    ];
    const edges: Edge[] = [];
    let previous = ["orch"];
    let previousKind: Rank["kind"] | "orch" = "orch";

    ranks.forEach((r, ri) => {
      const x = rowX(r.phases.length);
      const ids = r.phases.map(({ phase, id }, i) => {
        nodes.push(
          step(id, x(i), (ri + 1) * ROW_H, {
            label: phase.profile,
            sub: `$${phase.costUsd.toFixed(2)} · ${phase.toolCalls} tools`,
            tone: toneFor(phase),
            width: NODE_W,
          }),
        );
        return id;
      });
      const label =
        r.kind === "verify" && previousKind === "coder"
          ? "auto-verify"
          : r.kind === "coder" && previousKind === "readers"
            ? "brief"
            : r.kind === "coder" && previousKind === "verify"
              ? "fix-up"
              : undefined;
      previous.forEach((from) =>
        ids.forEach((to, k) => edges.push(link(from, to, { label: k === 0 && previous.length === 1 ? label : undefined }))),
      );
      previous = ids;
      previousKind = r.kind;
    });

    const settle = report.decisionFlow.settle;
    if (settle) {
      nodes.push(
        step("settle", -NODE_W / 2, (ranks.length + 1) * ROW_H, {
          label: settle.action === "pr" ? `PR #${report.prNumber}` : settle.action,
          sub: "worktree settled",
          icon: GitPullRequest,
          tone: "success",
          width: NODE_W,
        }),
      );
      previous.forEach((from) => edges.push(link(from, "settle", { tone: "success", animated: true })));
    }
    return { nodes, edges };
  }, [ranks, report]);

  const phaseById = new Map(ranks.flatMap((r) => r.phases).map(({ phase, id }) => [id, phase]));
  const chosen = selected ? phaseById.get(selected) : undefined;

  return (
    <div className="border border-white/10">
      <FlowCanvas
        nodes={nodes}
        edges={edges}
        selectedId={selected}
        onSelect={setSelected}
        heightClass={ranks.length > 4 ? "h-[560px] md:h-[820px]" : ranks.length > 3 ? "h-[500px] md:h-[720px]" : "h-[460px] md:h-[620px]"}
        ariaLabel={`Agent pipeline for ${report.repo}: ${report.decisionFlow.phases.map((p) => p.profile).join(", ")}`}
        hint="tap an agent"
        minWidth={340}
      />
      {chosen ? (
        <div className="border-t border-white/10 p-4">{renderPhase(chosen)}</div>
      ) : selected === "orch" ? (
        <FlowDetail title="orchestrator" body={report.taskSummary} />
      ) : selected === "settle" && report.decisionFlow.settle ? (
        <FlowDetail
          title={`worktree settled · ${report.decisionFlow.settle.action}`}
          body={
            <a
              href={report.decisionFlow.settle.prUrl}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[12px] text-[#ff5c33] underline underline-offset-4"
            >
              {report.decisionFlow.settle.prUrl}
            </a>
          }
        />
      ) : (
        <FlowDetail empty="Tap an agent to see what it did, what it cost, and which tools it used." />
      )}
    </div>
  );
}
