"use client";

import { useState } from "react";
import { Bot, Check, FileCode2, ShieldCheck, X } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "../lib/utils";

type Scenario = "clean" | "bad";
type Tone = "normal" | "accent" | "dim" | "danger";

function Tile({ icon: Icon, label, tone = "normal" }: { icon: typeof Bot; label: string; tone?: Tone }) {
  return (
    <div className={cn("flex flex-col items-center gap-2 transition-opacity duration-300", tone === "dim" && "opacity-30")}>
      <div
        className={cn(
          "flex size-14 items-center justify-center border transition-colors duration-300",
          tone === "accent" && "border-[#d5dde3] bg-[#d5dde3]",
          tone === "danger" && "border-red-500/40 bg-red-500/10",
          (tone === "normal" || tone === "dim") && "border-white/20",
        )}
      >
        <Icon
          className={cn(
            "size-6",
            tone === "accent" && "text-[#0c1014]",
            tone === "danger" && "text-red-400",
            (tone === "normal" || tone === "dim") && "text-[#7a848c]",
          )}
        />
      </div>
      <p className="font-mono text-[11px] text-[#d5dde3]">{label}</p>
    </div>
  );
}

function Connector({ tone = "dim", label }: { tone?: "dim" | "accent" | "danger"; label?: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-1">
      <span
        className={cn(
          "h-6 w-px",
          tone === "accent" && "bg-[#d5dde3]",
          tone === "danger" && "bg-red-400",
          tone === "dim" && "bg-white/15",
        )}
      />
      {label ? (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "flex items-center gap-1 font-mono text-[11px]",
            tone === "accent" && "text-[#d5dde3]",
            tone === "danger" && "text-red-400",
          )}
        >
          {tone === "accent" ? <Check className="size-3" /> : <X className="size-3" />}
          {label}
        </motion.p>
      ) : null}
    </div>
  );
}

export function EngineWriteDiagram() {
  const [scenario, setScenario] = useState<Scenario>("clean");

  return (
    <div className="border border-white/10">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3 md:px-6">
        <span className="font-mono text-[11px] tracking-[0.2em] text-[#7a848c] uppercase">apply_edit(auth.py)</span>
        <div className="flex font-mono text-[11px]">
          {(
            [
              { id: "clean", label: "clean edit" },
              { id: "bad", label: "bad edit" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setScenario(tab.id)}
              className={cn(
                "px-3 py-1.5 transition-colors duration-200",
                tab.id === scenario ? "text-[#ff5c33] underline underline-offset-4" : "text-[#7a848c] hover:text-[#d5dde3]",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid divide-y divide-white/10 md:grid-cols-2 md:divide-x md:divide-y-0">
        <div className="flex flex-col items-center px-8 py-10">
          <p className="mb-6 font-mono text-[11px] tracking-[0.2em] text-[#7a848c] uppercase">
            without a write funnel
          </p>
          <Tile icon={Bot} label="agent" />
          <Connector tone="dim" />
          <Tile icon={FileCode2} label="auth.py" tone="accent" />
          <p className="mt-6 max-w-[16rem] text-center text-[13px] leading-6 text-[#7a848c]">
            Writes go straight to disk. A broken edit saves just as easily as a good one.
          </p>
        </div>

        <div className="flex flex-col items-center bg-white/[0.02] px-8 py-10">
          <p className="mb-6 font-mono text-[11px] tracking-[0.2em] text-[#7a848c] uppercase">with the write funnel</p>
          <Tile icon={Bot} label="agent" />
          <Connector tone="dim" />
          <Tile icon={ShieldCheck} label="write funnel" tone="accent" />
          {scenario === "clean" ? (
            <>
              <Connector tone="accent" label="committed" />
              <Tile icon={FileCode2} label="auth.py" tone="accent" />
            </>
          ) : (
            <>
              <Connector tone="danger" label="rejected" />
              <Tile icon={FileCode2} label="auth.py" tone="dim" />
            </>
          )}
          <p className="mt-6 max-w-[16rem] text-center text-[13px] leading-6 text-[#7a848c]">
            {scenario === "clean"
              ? "Six checks pass. The edit lands, journaled and undo-ready."
              : "The syntax gate catches a new ERROR node. Nothing is written."}
          </p>
        </div>
      </div>
    </div>
  );
}
