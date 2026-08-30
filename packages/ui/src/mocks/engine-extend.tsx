"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "../lib/utils";

type Tok = [text: string, cls?: string];

const KW = "text-[#f2c14e]";
const DEC = "text-[#ff5c33]";
const STR = "text-[#8ab4c8]";
const CMT = "text-[#8ab4c8]/50 italic";
const DEFAULT = "text-[#d5dde3]";

function CodeBlock({ lines }: { lines: Tok[][] }) {
  return (
    <>
      {lines.map((line, i) => (
        <div key={i}>
          {line.length === 0
            ? " "
            : line.map(([text, cls], j) => (
                <span key={j} className={cls ?? DEFAULT}>
                  {text}
                </span>
              ))}
        </div>
      ))}
    </>
  );
}

type Surface = {
  id: "tools" | "wire";
  label: string;
  lane: string;
  for: string;
  rule: string;
  file: string;
  blurb: string;
  codeLines: Tok[][];
};

const surfaces: Surface[] = [
  {
    id: "tools",
    label: "Tools",
    lane: "fast lane",
    for: "the model",
    rule: "If the agent should read git, add a tool.",
    file: "tools/echo.py",
    blurb:
      "Drop a module under tools/. Decorate the function. Restart the session — the engine imports the package tree and registers anything with @tool. No catalog list to edit, no client to rebuild. AgentLoop sends those schemas on each model call and, if the model returns tool_calls, runs them and calls again (capped at 8 turns).",
    codeLines: [
      [
        ["from ", KW],
        ["tools.base"],
        [" import ", KW],
        ["ToolContext, tool"],
      ],
      [],
      [
        ["@tool", DEC],
        ["(description="],
        ['"Echo text back."', STR],
        [")"],
      ],
      [["def ", KW], ["echo"], ["(ctx: ToolContext, text: str) -> str:"]],
      [["    return ", KW], ["text"]],
      [],
      [["# name = function name", CMT]],
      [["# schema from type hints, or parameters=", CMT]],
      [["# ctx.workspace is the project root", CMT]],
    ],
  },
  {
    id: "wire",
    label: "Commands / events",
    lane: "slow lane",
    for: "the client",
    rule: "If the UI should show git without asking the LLM, add a command and an event.",
    file: "protocol/commands.py",
    blurb:
      "A TUI in any language has to agree on the JSON type name, so this path stays cataloged instead of dropped in. @command / @event fill COMMANDS / EVENTS; @handles wires a method on EngineSession. dummy_client looks up type names the same way any other client would — start is the only nickname it gets for free.",
    codeLines: [
      [["@command", DEC]],
      [["@dataclass", DEC]],
      [["class ", KW], ["OpenFile"], ["(ProtocolMessage):"]],
      [["    path: str"]],
      [],
      [["@handles", DEC], ["(OpenFile)"]],
      [["def ", KW], ["_on_open_file"], ["(self, command: OpenFile) -> None:"]],
      [["    ...", CMT]],
      [["    self._emit(FileContent(path=rel, content=content))"]],
      [],
      [["@event", DEC]],
      [["@dataclass", DEC]],
      [["class ", KW], ["FileClosed"], ["(ProtocolMessage):"]],
      [["    path: str"]],
    ],
  },
];

export function EngineExtend() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<Surface["id"]>("tools");
  const current = surfaces.find((item) => item.id === active) ?? surfaces[0];

  return (
    <div className="border border-[#ff5c33]/25 bg-[#080b0e]">
      <div className="flex flex-wrap items-center gap-2 border-b border-[#ff5c33]/20 bg-[#0c1014] px-5 py-3 md:px-6">
        <span className="mr-1 font-mono text-[10px] tracking-[0.2em] text-[#8ab4c8]/70 uppercase">Surface</span>
        {surfaces.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(item.id)}
            className={cn(
              "flex items-baseline gap-2 px-3.5 py-2 font-mono transition-colors duration-200",
              item.id === active
                ? "bg-[#ff5c33] text-[#0c1014]"
                : "border border-[#ff5c33]/25 text-[#8ab4c8] hover:border-[#ff5c33]/50 hover:text-[#ece8e1]",
            )}
          >
            <span className={cn("text-[10px] tracking-[0.15em] uppercase", item.id === active ? "text-[#0c1014]/70" : "text-[#8ab4c8]/60")}>
              0{i + 1}
            </span>
            <span className="text-[13px]">{item.label}</span>
            <span className={cn("text-[10px] tracking-[0.1em] uppercase", item.id === active ? "text-[#0c1014]/70" : "text-[#8ab4c8]/50")}>
              {item.lane}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col items-stretch lg:flex-row lg:items-start">
        <div className="border-b border-[#ff5c33]/20 p-6 lg:w-[44%] lg:border-r lg:border-b-0 md:p-8">
          <p className="font-mono text-[11px] tracking-[0.2em] text-[#f2c14e] uppercase">
            {current.file} · for {current.for}
          </p>
          <p className="mt-3 text-[15px] leading-7 text-[#b7c9d4]">{current.blurb}</p>
          <p className="mt-4 border-l-2 border-[#ff5c33] pl-3 font-mono text-[13px] leading-6 text-[#ece8e1]">
            {current.rule}
          </p>
        </div>
        <motion.pre
          key={current.id}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="min-w-0 overflow-x-auto p-6 font-mono text-[12px] leading-7 sm:text-[13px] md:p-8 lg:w-[56%]"
        >
          <CodeBlock lines={current.codeLines} />
        </motion.pre>
      </div>

      <div className="overflow-x-auto border-t border-[#ff5c33]/20 px-5 py-4 font-mono text-[11px] leading-6 text-[#8ab4c8] sm:text-[12px]">
        <p>
          <span className="text-[#ff5c33]">model</span>
          {"  --tool calls-->  "}
          <span className="text-[#ece8e1]">tools/*.py</span>
        </p>
        <p>
          <span className="text-[#ff5c33]">client</span>
          {"  --JSON cmd---->  "}
          <span className="text-[#ece8e1]">protocol/commands.py</span>
          {"  -->  "}
          <span className="text-[#f2c14e]">@handles</span>
        </p>
        <p>
          <span className="text-[#ff5c33]">engine</span>
          {"  --JSON event-->  "}
          <span className="text-[#ece8e1]">protocol/events.py</span>
        </p>
      </div>
    </div>
  );
}
