"use client";

import { useMemo, useState } from "react";

import { FlowCanvas, FlowDetail, link, step, type FlowNode, type FlowTone } from "../components/flow";
import { cn } from "../lib/utils";

const rungs = [
  { id: "r1", label: "search / list_files", tier: "grep", why: "Locate the file. Free, but it can't tell a symbol from a string." },
  { id: "r2", label: "list_symbols", tier: "tree-sitter", why: "See what's in the file without reading all of it." },
  {
    id: "r3",
    label: "find_symbol",
    tier: "tree-sitter",
    why: "One definition's source, plus its 1-based coordinate — the handoff into the LSP tools.",
  },
  {
    id: "r4",
    label: "goto_definition / find_references / hover",
    tier: "LSP",
    why: "The cross-file, cross-type question. Only the language server knows which parse_config this is.",
  },
  { id: "r5", label: "get_diagnostics", tier: "LSP", why: "What the type checker already knows about the file." },
  { id: "r6", label: "read_file", tier: "grep", why: "Windows for whatever context is still missing — never a whole file by default." },
] as const;

const questions = [
  { id: "where", label: "where is the auth middleware?", stop: 0 },
  { id: "outline", label: "what's in session.ts?", stop: 1 },
  { id: "source", label: "show me parse_config", stop: 2 },
  { id: "callers", label: "who calls parse_config?", stop: 3 },
] as const;

const W = 320;
const ROW = 92;

export function EngineReadLadder() {
  const [question, setQuestion] = useState<(typeof questions)[number]["id"]>("callers");
  const [selected, setSelected] = useState<string | null>(null);
  const stop = questions.find((q) => q.id === question)?.stop ?? 3;

  const { nodes, edges } = useMemo(() => {
    const nodes: FlowNode[] = rungs.map((rung, i) => {
      const tone: FlowTone = i < stop ? "default" : i === stop ? "success" : "muted";
      return step(rung.id, -W / 2, i * ROW, {
        label: rung.label,
        sub: i === stop ? "answered here" : i < stop ? "tried, climbed on" : undefined,
        tag: rung.tier,
        tone,
        width: W,
        align: "left",
      });
    });
    const edges = rungs.slice(1).map((rung, i) => {
      const reached = i + 1 <= stop;
      const handoff = i === 2;
      return link(rungs[i].id, rung.id, {
        tone: reached ? (handoff ? "accent" : "default") : "muted",
        animated: reached,
        label: handoff ? "coordinate handoff" : undefined,
      });
    });
    return { nodes, edges };
  }, [stop]);

  const rung = rungs.find((r) => r.id === selected);

  return (
    <div className="border border-white/10">
      <div className="flex flex-wrap items-center gap-1 border-b border-white/10 px-4 py-3 font-mono text-[11px] md:px-5">
        <span className="mr-2 text-[10px] tracking-[0.2em] text-[#7a848c]/70 uppercase">ask</span>
        {questions.map((q) => (
          <button
            key={q.id}
            type="button"
            onClick={() => {
              setQuestion(q.id);
              setSelected(null);
            }}
            className={cn(
              "px-2.5 py-1.5 transition-colors duration-200",
              q.id === question ? "text-[#ff5c33] underline underline-offset-4" : "text-[#7a848c] hover:text-[#d5dde3]",
            )}
          >
            {q.label}
          </button>
        ))}
      </div>
      <FlowCanvas
        nodes={nodes}
        edges={edges}
        selectedId={selected}
        onSelect={setSelected}
        heightClass="h-[500px] md:h-[600px]"
        layoutKey={question}
        minWidth={340}
        ariaLabel="The read ladder: search, list_symbols, find_symbol, the LSP tools, get_diagnostics, then read_file. A question climbs only until one rung answers it."
      />
      <FlowDetail
        title={rung ? `${rung.label} · ${rung.tier}` : null}
        body={rung?.why}
        empty="Pick a question: it climbs until one rung answers. Tap a rung for what it's for."
      />
    </div>
  );
}
