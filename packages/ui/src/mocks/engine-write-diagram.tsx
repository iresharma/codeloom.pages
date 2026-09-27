"use client";

import { useMemo, useState } from "react";
import { Bot, FileCode2, ShieldCheck } from "lucide-react";

import { FlowCanvas, lane, link, step, type FlowNode } from "../components/flow";
import { cn } from "../lib/utils";

type Scenario = "clean" | "bad";
const W = 150;
const LEFT = -W - 20;
const RIGHT = 20;

export function EngineWriteDiagram() {
  const [scenario, setScenario] = useState<Scenario>("clean");
  const bad = scenario === "bad";

  const { nodes, edges } = useMemo(() => {
    const nodes: FlowNode[] = [
      lane("l-without", LEFT, -34, "without a funnel", W),
      lane("l-with", RIGHT, -34, "with the funnel", W),
      step("a1", LEFT, 0, { label: "agent", icon: Bot, width: W }, { selectable: false }),
      step("f1", LEFT, 250, {
        label: "auth.py",
        sub: bad ? "broken edit saved" : "saved",
        icon: FileCode2,
        tone: bad ? "danger" : "default",
        width: W,
      }, { selectable: false }),
      step("a2", RIGHT, 0, { label: "agent", icon: Bot, width: W }, { selectable: false }),
      step("gate", RIGHT, 125, { label: "write funnel", sub: "six checks", icon: ShieldCheck, tone: "active", width: W }, { selectable: false }),
      step("f2", RIGHT, 250, {
        label: "auth.py",
        sub: bad ? "untouched" : "committed, undo-ready",
        icon: FileCode2,
        tone: bad ? "muted" : "success",
        width: W,
      }, { selectable: false }),
    ];
    const edges = [
      link("a1", "f1", { tone: bad ? "danger" : "default", animated: true, label: "straight to disk" }),
      link("a2", "gate", { animated: true }),
      link("gate", "f2", {
        tone: bad ? "danger" : "success",
        animated: !bad,
        dashed: bad,
        label: bad ? "rejected" : "committed",
      }),
    ];
    return { nodes, edges };
  }, [bad]);

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

      <FlowCanvas
        nodes={nodes}
        edges={edges}
        heightClass="h-[380px] md:h-[420px]"
        layoutKey={scenario}
        minWidth={340}
        ariaLabel={`Write path, ${scenario} edit: without a funnel the agent writes straight to disk; with the funnel, the edit is ${bad ? "rejected and nothing is written" : "committed"}.`}
      />
      <p className="border-t border-white/10 px-6 py-4 text-center text-[13px] leading-6 text-[#7a848c]">
        {bad
          ? "Without a funnel, the broken edit saves like any other. With it, the syntax gate catches a new ERROR node and nothing is written."
          : "Six checks pass. The edit lands, journaled and undo-ready."}
      </p>
    </div>
  );
}
