"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Braces, CheckCircle2, Circle, FileSearch, Fingerprint, HardDrive, Lock, RotateCcw, Save, XCircle } from "lucide-react";
import { useInView, useReducedMotion } from "motion/react";

import { FlowCanvas, link, step, type EdgeTone, type FlowNode, type FlowTone } from "../components/flow";
import { cn } from "../lib/utils";

type Scenario = "happy" | "rejected" | "rollback";
type Status = "pending" | "active" | "passed" | "failed" | "skip";
type Verdict = "running" | "success" | "failed" | "reverting" | "reverted";

const stages = [
  { id: "read", label: "read", sub: "read before edit", icon: FileSearch },
  { id: "guard", label: "guard", sub: "no escapes, no secrets", icon: Lock },
  { id: "identity", label: "id", sub: "SHA matches last read", icon: Fingerprint },
  { id: "syntax", label: "syntax", sub: "tree-sitter re-parse", icon: Braces },
  { id: "atomic", label: "write", sub: "atomic, whole batch", icon: Save },
  { id: "undo", label: "undo", sub: "before/after journaled", icon: RotateCcw },
] as const;

const NODE_W = 190;
const ROW = 74;

const STAGE_TONE: Record<Status, FlowTone> = {
  pending: "ghost",
  skip: "muted",
  active: "active",
  passed: "default",
  failed: "danger",
};

const DISK: Record<Verdict, { tone: FlowTone; sub: string }> = {
  running: { tone: "ghost", sub: "waiting" },
  success: { tone: "success", sub: "committed" },
  failed: { tone: "danger", sub: "untouched — nothing written" },
  reverting: { tone: "warn", sub: "restoring before bytes" },
  reverted: { tone: "default", sub: "restored, SHAs re-verified" },
};

const FAIL_AT = 3; // syntax
const STEP_MS = 500;

const captions: Record<Scenario, string> = {
  happy: "Six checks pass. The edit lands, journaled and undo-ready.",
  rejected: "The syntax gate catches a new ERROR node. Nothing is written.",
  rollback: "Committed, then undone. undo_edit re-verifies every SHA before restoring the before bytes.",
};

const VERDICT_LABEL: Record<Verdict, string> = {
  running: "running",
  success: "committed",
  failed: "rejected",
  reverting: "rolling back",
  reverted: "reverted",
};

function VerdictIcon({ verdict, className }: { verdict: Verdict; className?: string }) {
  if (verdict === "success") return <CheckCircle2 className={className} />;
  if (verdict === "failed") return <XCircle className={className} />;
  if (verdict === "reverting" || verdict === "reverted") return <RotateCcw className={cn(className, verdict === "reverting" && "animate-spin")} />;
  return <Circle className={cn(className, "animate-pulse")} />;
}

export function EngineLifecycle() {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.35 });

  const [scenario, setScenario] = useState<Scenario>("happy");
  const [index, setIndex] = useState(-1);
  const [reverseIndex, setReverseIndex] = useState(-1);
  const [phase, setPhase] = useState<"forward" | "committed" | "reverting" | "settled">("forward");
  const [cycle, setCycle] = useState(0);
  const timeouts = useRef<number[]>([]);

  const ceiling = scenario === "rejected" ? FAIL_AT : stages.length - 1;

  const clearTimers = () => {
    timeouts.current.forEach((id) => window.clearTimeout(id));
    timeouts.current = [];
  };

  const play = () => {
    clearTimers();
    setReverseIndex(-1);
    if (reduce) {
      setIndex(ceiling);
      setPhase("settled");
      return;
    }
    setIndex(-1);
    setPhase("forward");
    for (let i = 0; i <= ceiling; i++) {
      timeouts.current.push(window.setTimeout(() => setIndex(i), 300 + i * STEP_MS));
    }
    const forwardEnd = 300 + ceiling * STEP_MS;
    if (scenario !== "rollback") {
      timeouts.current.push(window.setTimeout(() => setPhase("settled"), forwardEnd + 400));
      return;
    }
    timeouts.current.push(window.setTimeout(() => setPhase("committed"), forwardEnd + 500));
    const reverseStart = forwardEnd + 1100;
    timeouts.current.push(window.setTimeout(() => setPhase("reverting"), reverseStart));
    // reverseIndex sweeps 5 → -1: stages with index > reverseIndex read as "pending" (undone).
    // Starting at 5 keeps everything "passed" at the first tick, so the sweep is progressive, not an instant reset.
    for (let tick = 0; tick <= 6; tick++) {
      const i = 5 - tick;
      timeouts.current.push(window.setTimeout(() => setReverseIndex(i), reverseStart + tick * STEP_MS));
    }
    timeouts.current.push(window.setTimeout(() => setPhase("settled"), reverseStart + 7 * STEP_MS + 300));
  };

  useEffect(() => {
    if (!inView) return;
    play();
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, scenario, cycle, reduce]);

  const reverting = phase === "reverting" || (phase === "settled" && scenario === "rollback");

  const status = (i: number): Status => {
    if (reverting) return i > reverseIndex ? "pending" : "passed";
    if (scenario === "rejected" && i > FAIL_AT) return "skip";
    if (scenario === "rejected" && i === FAIL_AT && index >= FAIL_AT) return "failed";
    if (i < index) return "passed";
    if (i === index) return phase === "forward" ? "active" : "passed";
    return "pending";
  };

  const connectorStatus = (i: number): Status => {
    // connector i sits between stage i and stage i+1
    if (reverting) return i > reverseIndex ? "pending" : "passed";
    if (scenario === "rejected" && i >= FAIL_AT) return "skip";
    if (i < index) return "passed";
    return "pending";
  };

  const verdict: Verdict =
    scenario === "rejected"
      ? phase === "settled"
        ? "failed"
        : "running"
      : scenario === "happy"
        ? phase === "settled"
          ? "success"
          : "running"
        : phase === "forward"
          ? "running"
          : phase === "committed"
            ? "success"
            : phase === "reverting"
              ? "reverting"
              : "reverted";

  const { nodes, edges } = useMemo(() => {
    const disk = DISK[verdict];
    const nodes: FlowNode[] = stages.map((stage, i) =>
      step(stage.id, -NODE_W / 2, i * ROW, {
        label: stage.label,
        sub: stage.sub,
        icon: stage.icon,
        tone: STAGE_TONE[status(i)],
        width: NODE_W,
        align: "left",
      }, { selectable: false }),
    );
    nodes.push(
      step("disk", -NODE_W / 2, stages.length * ROW + 24, {
        label: "auth.py on disk",
        sub: disk.sub,
        icon: HardDrive,
        tone: disk.tone,
        width: NODE_W,
        align: "left",
      }, { selectable: false }),
    );
    const connectorTone = (st: Status): EdgeTone => (st === "passed" || st === "active" ? "default" : "muted");
    const edges = stages.slice(1).map((stage, i) =>
      link(stages[i].id, stage.id, {
        tone: connectorTone(connectorStatus(i)),
        animated: !reverting && phase === "forward" && index === i && !(scenario === "rejected" && i === FAIL_AT),
      }),
    );
    if (scenario === "rejected") {
      const failed = status(FAIL_AT) === "failed";
      edges.push(
        link(stages[FAIL_AT].id, "disk", {
          from: "r",
          to: "r",
          tone: failed ? "danger" : "muted",
          dashed: true,
          label: failed ? "rejected" : undefined,
          id: "reject",
        }),
      );
    }
    edges.push(
      link(stages[stages.length - 1].id, "disk", {
        tone: verdict === "success" ? "success" : reverting ? "warn" : "muted",
        animated: verdict === "success" || phase === "reverting",
        label: verdict === "success" ? "committed" : reverting ? "undo_edit" : undefined,
      }),
    );
    return { nodes, edges };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, reverseIndex, phase, scenario, verdict]);

  return (
    <div
      ref={root}
      className={cn(
        "border bg-[#080b0e] transition-colors duration-500",
        verdict === "success" && "border-emerald-500/40",
        verdict === "failed" && "border-red-500/40",
        (verdict === "reverting" || verdict === "reverted") && "border-white/25",
        verdict === "running" && "border-white/15",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3 md:px-6">
        <div className="flex flex-wrap items-center gap-1 font-mono text-[11px]">
          {(
            [
              { id: "happy", label: "happy path" },
              { id: "rejected", label: "rejected" },
              { id: "rollback", label: "rolled back" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                // Reset synchronously so `phase` never renders paired with the new `scenario`
                // for a stray frame — that mismatch briefly computed a spurious verdict and
                // orphaned the badge's AnimatePresence transition.
                clearTimers();
                setIndex(-1);
                setReverseIndex(-1);
                setPhase("forward");
                setScenario(tab.id);
              }}
              className={cn(
                "px-3 py-1.5 transition-colors duration-200",
                tab.id === scenario
                  ? "text-[#ff5c33] underline underline-offset-4"
                  : "text-[#7a848c] hover:text-[#d5dde3]",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex items-center gap-1.5 font-mono text-[11px] tracking-[0.05em] uppercase transition-colors duration-300",
              verdict === "running" && "text-[#7a848c]",
              verdict === "success" && "text-emerald-400",
              verdict === "failed" && "text-red-400",
              (verdict === "reverting" || verdict === "reverted") && "text-[#d5dde3]",
            )}
          >
            <VerdictIcon verdict={verdict} className="size-3" />
            {VERDICT_LABEL[verdict]}
          </div>
          <button
            type="button"
            onClick={() => setCycle((n) => n + 1)}
            className="flex items-center gap-1.5 px-2 py-1.5 font-mono text-[11px] tracking-[0.1em] text-[#7a848c] uppercase transition-colors duration-200 hover:text-[#d5dde3]"
          >
            <RotateCcw className="size-3" />
            replay
          </button>
        </div>
      </div>

      <FlowCanvas
        nodes={nodes}
        edges={edges}
        heightClass="h-[560px] md:h-[640px]"
        ariaLabel={`Write funnel, ${scenario} scenario: read, guard, id, syntax, write, undo, then disk. Verdict: ${VERDICT_LABEL[verdict]}.`}
      />

      <p className="border-t border-white/10 px-6 py-4 text-center text-[13px] leading-6 text-[#7a848c] md:px-10">
        {captions[scenario]}
      </p>
    </div>
  );
}
