"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "../lib/utils";

const runs = [
  { id: "#1084", title: "fix auth", status: "live" },
  { id: "#1083", title: "rate limit", status: "done" },
  { id: "#1081", title: "docs sync", status: "done" },
  { id: "#1079", title: "cli flags", status: "fail" },
] as const;

const tools = [
  { verb: "read", target: "src/auth.ts" },
  { verb: "edit", target: "+12 −3" },
];

const diff = [
  { kind: "ctx", text: "export function" },
  { kind: "del", text: "if (!tok) return" },
  { kind: "add", text: "if (!tok) throw" },
  { kind: "add", text: "  new AuthError()" },
  { kind: "ctx", text: "const s = verify" },
  { kind: "del", text: "retry(3)" },
  { kind: "add", text: "await refresh()" },
] as const;

const dotClass: Record<(typeof runs)[number]["status"], string> = {
  live: "bg-[#34d399]",
  done: "bg-[#7a848c]/60",
  fail: "bg-[#f87171]",
};

export function WebClientMock() {
  const reduce = useReducedMotion();

  return (
    <div
      role="img"
      aria-label="CodeLoom web client workspace: runs sidebar, live agent transcript, and an inspect pane showing a diff"
      className="flex h-[168px] flex-col overflow-hidden border border-white/10 bg-[#0c1014] font-mono text-[9px] leading-[13px] text-[#d5dde3]"
    >
      <div className="flex h-[18px] shrink-0 items-center gap-1 border-b border-white/10 bg-[#101418] px-1.5">
        <span className="size-1.5 bg-[#f87171]/70" />
        <span className="size-1.5 bg-[#fbbf24]/70" />
        <span className="size-1.5 bg-[#34d399]/70" />
        <span className="ml-1.5 min-w-0 flex-1 truncate border border-white/10 bg-[#0a0d10] px-1 text-[8px] leading-[11px] text-[#7a848c]">
          codeloom · RUN #1084
        </span>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[4.5rem_1fr_5rem]">
        <div className="min-w-0 overflow-hidden border-r border-white/10 bg-[#0a0d10] py-1">
          <p className="truncate px-1.5 pb-0.5 text-[8px] tracking-[0.08em] text-[#7a848c]/70 uppercase">runs</p>
          {runs.map((run, i) => (
            <div
              key={run.id}
              className={cn(
                "flex items-center gap-1 border-l-2 px-1.5 py-[2px]",
                i === 0 ? "border-[#34d399] bg-[#34d399]/10 text-[#d5dde3]" : "border-transparent text-[#7a848c]",
              )}
            >
              <span className={cn("size-1 shrink-0", dotClass[run.status])} />
              <span className="min-w-0 truncate">
                {run.id} {run.title}
              </span>
            </div>
          ))}
        </div>

        <div className="flex min-w-0 flex-col gap-1 overflow-hidden px-1.5 py-1">
          <div className="min-w-0">
            <p className="text-[8px] text-[#7a848c]/70 uppercase">you</p>
            <p className="truncate">Fix the flaky auth test, open a PR.</p>
          </div>
          <div className="min-w-0">
            <p className="text-[8px] text-[#22d3ee]/80 uppercase">agent</p>
            <p className="truncate text-[#d5dde3]/90">Token check swallows errors. Patching.</p>
          </div>
          {tools.map((tool) => (
            <div key={tool.verb} className="flex min-w-0 items-center gap-1 border border-white/10 bg-[#101418] px-1">
              <span className="text-[#34d399]">{tool.verb}</span>
              <span className="min-w-0 truncate text-[#7a848c]">{tool.target}</span>
            </div>
          ))}
          <div className="mt-auto flex items-center gap-1 text-[8px] text-[#7a848c]">
            <motion.span
              className="size-1.5 shrink-0 bg-[#34d399]"
              animate={reduce ? undefined : { opacity: [0.3, 1, 0.3] }}
              transition={reduce ? undefined : { duration: 1.6, repeat: Infinity }}
            />
            <span className="truncate">RUN #1084 · live</span>
          </div>
        </div>

        <div className="min-w-0 overflow-hidden border-l border-white/10 bg-[#0a0d10] py-1">
          <p className="truncate px-1 pb-0.5 text-[8px] tracking-[0.08em] text-[#7a848c]/70 uppercase">inspect · diff</p>
          <p className="truncate px-1 text-[8px] text-[#7a848c]">auth.ts</p>
          {diff.map((line, i) => (
            <div
              key={i}
              className={cn(
                "truncate px-1 text-[8px] leading-[12px]",
                line.kind === "add" && "bg-[#34d399]/10 text-[#6ee7b7]",
                line.kind === "del" && "bg-[#f87171]/10 text-[#fca5a5]",
                line.kind === "ctx" && "text-[#7a848c]",
              )}
            >
              {line.kind === "add" ? "+" : line.kind === "del" ? "−" : " "}
              {line.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
