"use client";

import { useEffect, useRef, useState } from "react";
import { Braces, CheckCircle2, Circle, FileSearch, Fingerprint, Lock, RotateCcw, Save, XCircle } from "lucide-react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";

import { cn } from "../lib/utils";

type Scenario = "happy" | "rejected" | "rollback";
type Status = "pending" | "active" | "passed" | "failed" | "skip";
type Verdict = "running" | "success" | "failed" | "reverting" | "reverted";

const stages = [
  { id: "read", label: "read", icon: FileSearch },
  { id: "guard", label: "guard", icon: Lock },
  { id: "identity", label: "id", icon: Fingerprint },
  { id: "syntax", label: "syntax", icon: Braces },
  { id: "atomic", label: "write", icon: Save },
  { id: "undo", label: "undo", icon: RotateCcw },
] as const;

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

function Tile({ icon: Icon, label, status }: { icon: typeof FileSearch; label: string; status: Status }) {
  const reduce = useReducedMotion();
  return (
    <div className={cn("flex flex-col items-center gap-1.5 transition-opacity duration-300", status === "skip" && "opacity-30")}>
      <span className="relative flex size-11 items-center justify-center">
        {status === "active" && !reduce ? (
          <motion.span
            className="absolute rounded-full bg-white/20"
            animate={{ width: [11, 30], height: [11, 30], opacity: [0.6, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "easeOut" }}
          />
        ) : null}
        <span
          className={cn(
            "relative flex size-11 items-center justify-center border transition-colors duration-300",
            status === "failed" && "border-red-400 bg-red-500/10",
            (status === "passed" || status === "active") && "border-[#d5dde3] bg-[#d5dde3]/10",
            (status === "pending" || status === "skip") && "border-white/15 bg-[#0c1014]",
          )}
        >
          <Icon
            className={cn(
              "size-5",
              status === "failed" && "text-red-400",
              (status === "passed" || status === "active") && "text-[#d5dde3]",
              (status === "pending" || status === "skip") && "text-[#7a848c]/60",
            )}
          />
        </span>
      </span>
      <span className={cn("font-mono text-[10px] uppercase tracking-wider", status === "pending" || status === "skip" ? "text-[#7a848c]/50" : "text-[#d5dde3]")}>
        {label}
      </span>
    </div>
  );
}

function Connector({ status, showDot }: { status: Status; showDot: boolean }) {
  return (
    <div className="relative mt-[1.375rem] flex h-px flex-1 items-center">
      <span
        className={cn(
          "h-px w-full transition-colors duration-300",
          status === "failed" && "bg-red-400",
          (status === "passed" || status === "active") && "bg-[#d5dde3]",
          (status === "pending" || status === "skip") && "bg-white/10",
        )}
      />
      <AnimatePresence>
        {showDot ? (
          <motion.span
            initial={{ opacity: 0, left: "0%" }}
            animate={{ opacity: 1, left: "100%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: STEP_MS / 1000, ease: "linear" }}
            className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d5dde3]"
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
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
    for (let step = 0; step <= 6; step++) {
      const i = 5 - step;
      timeouts.current.push(window.setTimeout(() => setReverseIndex(i), reverseStart + step * STEP_MS));
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
    if (i === index) return "active";
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

      <div className="px-6 pt-10 pb-6 md:px-10">
        <div className="flex items-start">
          {stages.map((stage, i) => (
            <div key={stage.id} className="flex flex-1 items-start last:flex-none">
              <Tile icon={stage.icon} label={stage.label} status={status(i)} />
              {i < stages.length - 1 ? (
                <Connector
                  status={connectorStatus(i)}
                  showDot={!reverting && phase === "forward" && index === i && !(scenario === "rejected" && i === FAIL_AT)}
                />
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-5 flex min-h-[2.25rem] items-center justify-center">
          {verdict === "running" ? (
            <div className="flex items-center gap-2 font-mono text-[12px] text-[#7a848c]">
              <span className="size-1.5 animate-pulse rounded-full bg-[#7a848c]" />
              running…
            </div>
          ) : (
            <div
              className={cn(
                "flex items-center gap-2 border px-4 py-1.5 font-mono text-[12px] tracking-[0.02em] transition-colors duration-300",
                verdict === "success" && "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
                verdict === "failed" && "border-red-500/40 bg-red-500/10 text-red-400",
                (verdict === "reverting" || verdict === "reverted") && "border-white/25 bg-white/5 text-[#d5dde3]",
              )}
            >
              <VerdictIcon verdict={verdict} className="size-3.5" />
              {VERDICT_LABEL[verdict]}
            </div>
          )}
        </div>
      </div>

      <p className="border-t border-white/10 px-6 py-4 text-center text-[13px] leading-6 text-[#7a848c] md:px-10">
        {captions[scenario]}
      </p>
    </div>
  );
}
