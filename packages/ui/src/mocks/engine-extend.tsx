"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "../lib/utils";

const surfaces = [
  {
    id: "tools",
    label: "Tools",
    for: "the model",
    rule: "If the agent should read git, add a tool.",
    file: "tools/echo.py",
    blurb:
      "Drop a module under tools/. Decorate the function. Restart the session — the engine imports the package tree and registers anything with @tool. No catalog list to edit. AgentLoop sends those schemas on each model call and, if the model returns tool_calls, runs them and calls again (capped at 8 turns).",
    code: `from tools.base import ToolContext, tool

@tool(description="Echo text back.")
def echo(ctx: ToolContext, text: str) -> str:
    return text

# name = function name
# schema from type hints, or parameters=
# ctx.workspace is the project root`,
  },
  {
    id: "wire",
    label: "Commands / events",
    for: "the client",
    rule: "If the UI should show git without asking the LLM, add a command and an event.",
    file: "protocol/commands.py",
    blurb:
      "The TUI (or any other language) has to know the JSON type names, so they stay in two catalog files. @command / @event fill COMMANDS / EVENTS. @handles wires a method on EngineSession. dummy_client looks up type names; start is the only nickname.",
    code: `@command
@dataclass
class OpenFile(ProtocolMessage):
    path: str

@handles(OpenFile)
def _on_open_file(self, command: OpenFile) -> None:
    ...
    self._emit(FileContent(path=rel, content=content))

@event
@dataclass
class FileClosed(ProtocolMessage):
    path: str`,
  },
] as const;

export function EngineExtend() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<(typeof surfaces)[number]["id"]>("tools");
  const current = surfaces.find((item) => item.id === active) ?? surfaces[0];

  return (
    <div className="border border-[#ff5c33]/25 bg-[#080b0e]">
      <div className="grid border-b border-[#ff5c33]/20 sm:grid-cols-2">
        {surfaces.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(item.id)}
            className={cn(
              "px-5 py-4 text-left transition-colors duration-200",
              item.id === active
                ? "bg-[#ff5c33]/10 text-[#ece8e1]"
                : "text-[#8ab4c8] hover:bg-[#ff5c33]/5 hover:text-[#ece8e1]",
            )}
          >
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase">
              {item.id === "tools" ? "01" : "02"} · for {item.for}
            </p>
            <p className="mt-1 font-mono text-[15px]">{item.label}</p>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
        <div className="border-b border-[#ff5c33]/20 p-5 lg:border-r lg:border-b-0 md:p-6">
          <p className="font-mono text-[11px] tracking-[0.2em] text-[#f2c14e] uppercase">{current.file}</p>
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
          className="overflow-x-auto p-5 font-mono text-[12px] leading-7 text-[#d5dde3] sm:text-[13px] md:p-6"
        >
          {current.code}
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
