"use client";

import { motion } from "motion/react";

const lines = [
  { t: "12:04:01.102", event: "session.open", body: 'id="s_08f1" cwd="/work/api"' },
  { t: "12:04:01.118", event: "llm.wrap", body: "provider=openrouter model=anthropic/claude-sonnet-4" },
  { t: "12:04:01.201", event: "tool.file.read", body: "path=src/auth.ts bytes=4120" },
  { t: "12:04:01.340", event: "agent.spawn", body: 'role=worker task="patch flaky auth test"' },
  { t: "12:04:03.881", event: "tool.git.status", body: "dirty=2 branch=main" },
  { t: "12:04:08.002", event: "fold", body: "from=34 to=3 dropped=thinking,tool_noise" },
  { t: "12:04:08.014", event: "session.delta", body: "orchestrator context += folded worker" },
];

export function EngineMock() {
  return (
    <div className="relative">
      <div className="absolute -inset-8 bg-[radial-gradient(ellipse_at_center,rgba(255,92,51,0.16),transparent_70%)] blur-2xl" />
      <div className="relative overflow-hidden border border-[#ff5c33]/30 bg-[#080b0e] shadow-[0_40px_80px_-24px_rgba(0,0,0,0.85)]">
        <div className="flex items-center justify-between border-b border-[#ff5c33]/20 px-4 py-2 font-mono text-[11px]">
          <span className="text-[#ff5c33]">codeloom-engine.sock</span>
          <span className="text-[#8ab4c8]">NDJSON · unix · local</span>
          <span className="text-[#f2c14e]">inspect</span>
        </div>
        <div className="relative overflow-hidden px-4 py-3 font-mono text-[11px] leading-6 sm:text-[12px]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#ff5c33]/10 to-transparent"
          />
          {lines.map((line, i) => (
            <motion.p
              key={line.event}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18 * i, duration: 0.35 }}
              className="flex flex-wrap gap-x-3"
            >
              <span className="text-[#8ab4c8]/70">{line.t}</span>
              <span className={line.event === "fold" ? "text-[#f2c14e]" : "text-[#ff5c33]"}>
                {line.event}
              </span>
              <span className="text-[#ece8e1]/80">{line.body}</span>
            </motion.p>
          ))}
          <motion.p
            className="mt-1 text-[#ff5c33]"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            ▍ waiting on unix://
          </motion.p>
        </div>
        <div className="grid grid-cols-3 border-t border-[#ff5c33]/20 font-mono text-[10px] uppercase tracking-wider text-[#8ab4c8]">
          <span className="border-r border-[#ff5c33]/20 px-3 py-2">sessions 1</span>
          <span className="border-r border-[#ff5c33]/20 px-3 py-2">workers 1</span>
          <span className="px-3 py-2 text-[#f2c14e]">folded 34→3</span>
        </div>
      </div>
    </div>
  );
}
