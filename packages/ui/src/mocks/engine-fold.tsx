"use client";

import { motion } from "motion/react";

const raw = [
  { kind: "think", text: "maybe the timeout is in the client retry loop…" },
  { kind: "tool", text: "grep timeout auth.spec.ts session.ts" },
  { kind: "result", text: "session.ts:88  timeout: 5_000" },
  { kind: "think", text: "5s is tight under CI load. bump and retest." },
  { kind: "tool", text: "file.write session.ts timeout 5s → 15s" },
  { kind: "result", text: "patched +1 / −1" },
  { kind: "think", text: "run the flaky spec again, twice, then stop." },
  { kind: "tool", text: "pnpm test --filter=api auth.spec" },
  { kind: "result", text: "ok  2 passed  0 flaky" },
];

const folded = [
  {
    n: "01",
    title: "Found the flake",
    body: "Worker traced the failure to session.ts:88 — a 5s timeout under CI, not the assertion.",
  },
  {
    n: "02",
    title: "Patched the timeout",
    body: "One-line change: 5s → 15s. No drive-by refactors.",
  },
  {
    n: "03",
    title: "Suite green",
    body: "auth.spec passed twice. Thinking and tool noise discarded.",
  },
];

const kindColor: Record<string, string> = {
  think: "text-[#8ab4c8]/70",
  tool: "text-[#ff5c33]",
  result: "text-[#f2c14e]",
};

export function EngineFold() {
  return (
    <div className="grid overflow-hidden border border-[#ff5c33]/25 lg:grid-cols-[1.1fr_auto_0.9fr]">
      <div className="bg-[#080b0e] p-5 md:p-6">
        <p className="font-mono text-[11px] tracking-[0.2em] text-[#8ab4c8] uppercase">
          Worker trail · 34 messages
        </p>
        <ol className="relative mt-4 max-h-[22rem] space-y-2 overflow-hidden">
          {raw.map((row, i) => (
            <motion.li
              key={`${row.kind}-${i}`}
              initial={{ opacity: 0.35, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="origin-top border border-white/6 bg-[#10161c] px-3 py-2 font-mono text-[12px]"
              style={{ animation: `fold-compress 4.8s ${0.4 + i * 0.12}s ease-in-out infinite alternate` }}
            >
              <span className={`mr-3 uppercase ${kindColor[row.kind]}`}>{row.kind}</span>
              <span className="text-[#ece8e1]/80">{row.text}</span>
            </motion.li>
          ))}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#080b0e] to-transparent" />
        </ol>
        <p className="mt-3 font-mono text-[11px] text-[#8ab4c8]/70">
          +25 more · thinking · tool_call · tool_result
        </p>
      </div>

      <div className="flex items-center justify-center border-y border-[#ff5c33]/25 bg-[#10161c] px-4 py-5 font-mono text-[11px] tracking-[0.35em] text-[#f2c14e] uppercase lg:border-x lg:border-y-0 lg:px-3 lg:py-8 lg:[writing-mode:vertical-rl]">
        fold
      </div>

      <div className="bg-[#10161c] p-5 md:p-6">
        <p className="font-mono text-[11px] tracking-[0.2em] text-[#f2c14e] uppercase">
          Folded into orchestrator · 3 messages
        </p>
        <ol className="mt-4 space-y-3">
          {folded.map((item, i) => (
            <motion.li
              key={item.n}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.15 * i }}
              className="border border-[#f2c14e]/25 bg-[#0c1014] p-4"
            >
              <p className="font-mono text-[11px] text-[#ff5c33]">{item.n}</p>
              <h3 className="mt-1 text-[15px] text-[#ece8e1]">{item.title}</h3>
              <p className="mt-2 text-[13px] leading-6 text-[#8ab4c8]">{item.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}
