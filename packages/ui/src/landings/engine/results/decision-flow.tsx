"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { GitPullRequest, Route } from "lucide-react";
import type { Edge } from "@xyflow/react";

import {
  FlowCanvas,
  FlowDetail,
  lane,
  link,
  step,
  type FlowNode,
  type FlowTone,
} from "../../../components/flow";
import type { EngineResultReport, FlowPhase } from "./types";

const READERS = new Set(["ask", "researcher", "debugger"]);
const VERIFIERS = new Set(["tester", "reviewer"]);

const NODE_W = 130;
const GAP_X = 20;
const ROW_H = 84;

type Rank = {
  kind: "readers" | "coder" | "verify" | "other";
  phases: { phase: FlowPhase; id: string }[];
};

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
    if (
      last &&
      last.kind === kind &&
      (kind === "readers" || kind === "verify")
    ) {
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
  const [selected, setSelected] = useState<string | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const [wide, setWide] = useState(false);
  useEffect(() => {
    if (!box.current) return;
    const observer = new ResizeObserver(([entry]) =>
      setWide(entry.contentRect.width >= 860),
    );
    observer.observe(box.current);
    return () => observer.disconnect();
  }, []);

  const { nodes, edges } = useMemo(() => {
    const point = (column: number, index = 0, count = 1) =>
      wide
        ? { x: column * 170, y: (index - (count - 1) / 2) * 84 }
        : { x: rowX(count)(index), y: column * ROW_H };
    const choose = (id: string) => () =>
      setSelected((current) => (current === id ? null : id));
    const origin = point(0);
    const nodes: FlowNode[] = [
      step("orch", origin.x, origin.y, {
        label: "Task",
        sub: "orchestrator",
        icon: Route,
        tone: "accent",
        width: NODE_W,
        onChoose: choose("orch"),
      }),
    ];
    const edges: Edge[] = [];
    let previous = ["orch"];

    ranks.forEach((r, ri) => {
      if (wide)
        nodes.push(
          lane(
            `lane-${ri}`,
            (ri + 1) * 170,
            -110,
            r.kind === "readers"
              ? "Explore"
              : r.kind === "coder"
                ? "Implement"
                : r.kind === "verify"
                  ? "Verify"
                  : "Work",
            NODE_W,
          ),
        );
      const ids = r.phases.map(({ phase, id }, i) => {
        nodes.push(
          step(
            id,
            point(ri + 1, i, r.phases.length).x,
            point(ri + 1, i, r.phases.length).y,
            {
              label: phase.profile,
              sub: phase.status || "status unrecorded",
              onChoose: choose(id),
              tone: toneFor(phase),
              width: NODE_W,
            },
          ),
        );
        return id;
      });
      previous.forEach((from) =>
        ids.forEach((to) =>
          edges.push(
            link(from, to, {
              from: wide ? "r" : "b",
              to: wide ? "l" : "t",
            }),
          ),
        ),
      );
      previous = ids;
    });

    const settle = report.decisionFlow.settle;
    if (settle) {
      nodes.push(
        step("settle", point(ranks.length + 1).x, point(ranks.length + 1).y, {
          label:
            settle.action === "pr" ? `PR #${report.prNumber}` : settle.action,
          sub: "submitted",
          onChoose: choose("settle"),
          icon: GitPullRequest,
          tone: "success",
          width: NODE_W,
        }),
      );
      previous.forEach((from) =>
        edges.push(
          link(from, "settle", {
            tone: "default",
            from: wide ? "r" : "b",
            to: wide ? "l" : "t",
          }),
        ),
      );
    }
    return { nodes: nodes.map((n) => ({ ...n, focusable: false })), edges };
  }, [ranks, report, wide]);

  const phaseById = new Map(
    ranks.flatMap((r) => r.phases).map(({ phase, id }) => [id, phase]),
  );
  const chosen = selected ? phaseById.get(selected) : undefined;

  return (
    <div ref={box} className="border border-white/10">
      <FlowCanvas
        nodes={nodes}
        edges={edges}
        selectedId={selected}
        onSelect={setSelected}
        heightClass={
          wide ? "h-[260px]" : ranks.length > 3 ? "h-[500px]" : "h-[420px]"
        }
        layoutKey={wide}
        padding={0.04}
        ariaLabel={`Agent pipeline for ${report.repo}: ${report.decisionFlow.phases.map((p) => p.profile).join(", ")}`}
        hint="select an agent"
        minWidth={0}
      />
      {chosen ? (
        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex justify-end">
            <button
              type="button"
              className="min-h-11 px-3 text-xs text-[#7eb5d0]"
              onClick={() => setSelected(null)}
            >
              Close agent details ×
            </button>
          </div>
          {renderPhase(chosen)}
        </div>
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
        <p className="border-t border-white/10 px-5 py-3 text-xs text-[#9ba6af]">
          Select a node for its task, tools and outcome. No agent selected.
        </p>
      )}
    </div>
  );
}
