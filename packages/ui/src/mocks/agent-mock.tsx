"use client";

import { PRODUCTS } from "@codeloom/config";
import { motion } from "motion/react";

const product = PRODUCTS.agent;

const steps = [
  { status: "done", label: "explore", meta: "214 files indexed", time: "12s" },
  { status: "done", label: "plan", meta: "3 files · 1 failing test", time: "4s" },
  { status: "done", label: "patch", meta: "session.ts, auth.spec.ts", time: "18s" },
  { status: "live", label: "test", meta: "pnpm test --filter=api", time: "41s" },
  { status: "wait", label: "pull request", meta: "waiting on green", time: "—" },
];

export function AgentMock() {
  return (
    <div className="relative">
      <div className="absolute -inset-10 rounded-[40px] bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.22),transparent_70%)] blur-2xl" />
      <div className="relative overflow-hidden rounded-3xl border border-amber-400/20 bg-[#0c0a12]/90 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] backdrop-blur">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-amber-400" />
            </span>
            <span className="font-mono text-[11px] tracking-wide text-amber-200/80">RUN #1084 · live</span>
          </div>
          <span className="font-mono text-[11px] text-zinc-500">sandbox · main</span>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs tracking-[0.2em] text-zinc-500 uppercase">Ticket</p>
          <p className="mt-1 text-sm text-zinc-200">Fix the flaky auth test and open a PR.</p>
        </div>
        <ol className="space-y-0 border-t border-white/5 px-3 py-3">
          {steps.map((step, i) => (
            <li key={step.label} className="relative flex gap-3 px-2 py-2.5">
              {i < steps.length - 1 ? (
                <span className="absolute top-8 left-[18px] h-[calc(100%-8px)] w-px bg-white/10" />
              ) : null}
              <span
                className={
                  step.status === "done"
                    ? "mt-1 size-2.5 shrink-0 rounded-full bg-emerald-400"
                    : step.status === "live"
                      ? "mt-1 size-2.5 shrink-0 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
                      : "mt-1 size-2.5 shrink-0 rounded-full border border-white/20"
                }
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-mono text-[12px] text-zinc-100">{step.label}</p>
                  <p className="font-mono text-[11px] text-zinc-500">{step.time}</p>
                </div>
                <p className="truncate font-mono text-[11px] text-zinc-500">{step.meta}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="flex items-center justify-between border-t border-white/5 px-5 py-3 font-mono text-[11px] text-zinc-500">
          <span>model · local-first</span>
          <motion.span
            className="text-amber-300"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            writing tests…
          </motion.span>
          <span style={{ color: product.accent.solid }}>you keep merge</span>
        </div>
      </div>
    </div>
  );
}
