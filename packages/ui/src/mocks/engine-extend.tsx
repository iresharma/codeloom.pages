"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { FlowCanvas, lane, link, step, type FlowNode, type FlowTone } from "../components/flow";
import { cn } from "../lib/utils";

const X = [0, 165, 330];
const NW = 135;

function useSurfaceFlow(active: "tools" | "wire") {
  return useMemo(() => {
    const tools = active === "tools";
    const on = (lit: boolean): FlowTone => (lit ? "default" : "muted");
    const nodes: FlowNode[] = [
      lane("l-tools", X[0], -30, "fast lane · the model", NW * 2 + 50),
      step("model", X[0], 0, { label: "model", sub: "returns tool_calls", tone: on(tools), width: NW }, { selectable: false }),
      step("toolpy", X[2], 0, { label: "tools/*.py", sub: "@tool, on restart", tone: tools ? "accent" : "muted", width: NW }, { selectable: false }),
      lane("l-wire", X[0], 96, "slow lane · the client", NW * 2 + 50),
      step("client", X[0], 126, { label: "client", sub: "TUI, web, REPL", tone: on(!tools), width: NW }, { selectable: false }),
      step("cmds", X[1], 126, { label: "commands.py", sub: "@command", tone: tools ? "muted" : "accent", width: NW }, { selectable: false }),
      step("session", X[2], 126, { label: "EngineSession", sub: "@handles", tone: on(!tools), width: NW }, { selectable: false }),
      step("events", X[1], 236, { label: "events.py", sub: "@event", tone: tools ? "muted" : "accent", width: NW }, { selectable: false }),
    ];
    const edges = [
      link("model", "toolpy", { from: "r", to: "l", label: "tool calls", tone: tools ? "accent" : "muted", animated: tools }),
      link("client", "cmds", { from: "r", to: "l", label: "JSON cmd", tone: tools ? "muted" : "default", animated: !tools }),
      link("cmds", "session", { from: "r", to: "l", tone: tools ? "muted" : "default", animated: !tools }),
      link("session", "events", { from: "b", to: "r", label: "JSON event", tone: tools ? "muted" : "default", animated: !tools }),
      link("events", "client", { from: "l", to: "b", tone: tools ? "muted" : "default", animated: !tools }),
    ];
    return { nodes, edges };
  }, [active]);
}

type Tok = [text: string, cls?: string];

const KW = "text-[#9fb3bf]";
const DEC = "text-[#ff5c33]";
const STR = "text-[#7a848c]";
const CMT = "text-[#7a848c]/50 italic";
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
      "Drop a module under tools/. Decorate the function. Restart the session — the engine imports the package tree and registers anything with @tool. No catalog list to edit, no client to rebuild. AgentLoop sends those schemas on each model call and, if the model returns tool_calls, runs them and calls again (capped at 16 turns).",
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
  const flow = useSurfaceFlow(active);

  return (
    <div className="border border-white/10">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-5 py-3 md:px-6">
        <span className="mr-1 font-mono text-[10px] tracking-[0.2em] text-[#7a848c]/70 uppercase">Surface</span>
        {surfaces.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(item.id)}
            className={cn(
              "flex items-baseline gap-2 px-3.5 py-2 font-mono transition-colors duration-200",
              item.id === active
                ? "text-[#ff5c33] underline underline-offset-4"
                : "text-[#7a848c] hover:text-[#d5dde3]",
            )}
          >
            <span className={cn("text-[10px] tracking-[0.15em] uppercase", item.id === active ? "text-[#ff5c33]/70" : "text-[#7a848c]/60")}>
              0{i + 1}
            </span>
            <span className="text-[13px]">{item.label}</span>
            <span className={cn("text-[10px] tracking-[0.1em] uppercase", item.id === active ? "text-[#ff5c33]/70" : "text-[#7a848c]/50")}>
              {item.lane}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col items-stretch lg:flex-row lg:items-start">
        <div className="border-b border-white/10 p-6 lg:w-[44%] lg:border-r lg:border-b-0 md:p-8">
          <p className="font-mono text-[11px] tracking-[0.2em] text-[#7a848c] uppercase">
            {current.file} · for {current.for}
          </p>
          <p className="mt-3 text-[15px] leading-7 text-[#7a848c]">{current.blurb}</p>
          <p className="mt-4 border-l-2 border-[#ff5c33] pl-3 font-mono text-[13px] leading-6 text-[#d5dde3]">
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

      <div className="border-t border-white/10">
        <FlowCanvas
          nodes={flow.nodes}
          edges={flow.edges}
          heightClass="h-[300px] md:h-[360px]"
          layoutKey={active}
          minWidth={480}
          ariaLabel="Two ways in: the model calls tools in tools/*.py; a client sends a JSON command through commands.py to an @handles method on EngineSession, which answers with a JSON event from events.py."
        />
      </div>
    </div>
  );
}
