"use client";

import { PRODUCTS } from "@codeloom/config";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { SiteFooter } from "../../../chrome/footer";
import { SiteNav } from "../../../chrome/site-nav";
import { EngineSubNav } from "../../../chrome/engine-subnav";
import { ProductShell } from "../../../components/product-shell";
import { Reveal } from "../../../magic/reveal";
import { codeloomEngineReport } from "./data/codeloom-engine";
import { reachAuthProxyReport } from "./data/reach-auth-proxy";
import { tracerReport } from "./data/tracer";
import { recommendationTone } from "./severity";
import type { EngineResultReport } from "./types";

const product = PRODUCTS.engine;

const reports: EngineResultReport[] = [codeloomEngineReport, reachAuthProxyReport, tracerReport];

const repoShort = (repo: string) => repo.split("/")[1] ?? repo;

const metrics: { label: string; get: (r: EngineResultReport) => number; format: (v: number) => string }[] = [
  { label: "cost", get: (r) => r.stats.costUsd, format: (v) => `$${v.toFixed(2)}` },
  { label: "tokens", get: (r) => r.stats.totalTokens, format: (v) => `${(v / 1_000_000).toFixed(1)}M` },
  { label: "tool calls", get: (r) => r.stats.toolCalls, format: (v) => String(v) },
  { label: "elapsed", get: (r) => r.stats.elapsedSeconds, format: (v) => `${v.toFixed(0)}s` },
];

const severityColor: Record<string, string> = {
  critical: "#ef4444",
  high: "#ef4444",
  medium: "#f2c14e",
  low: "#7a848c",
};

function severityTally(reports: EngineResultReport[]) {
  const tally: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const report of reports) {
    for (const finding of [...report.codeReview.findings, ...report.processReview.findings]) {
      tally[finding.severity] = (tally[finding.severity] ?? 0) + 1;
    }
  }
  return tally;
}

export function EngineResultsIndexLanding() {
  const reduce = useReducedMotion();

  return (
    <ProductShell product={product} className="bg-[#0c1014]">
      <SiteNav active="engine" />
      <EngineSubNav active="results" />

      <main className="mx-auto max-w-3xl px-5 md:px-8">
        <section className="border-b border-white/10 py-14 md:py-20">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-[12px] tracking-[0.15em] text-[#7a848c] uppercase"
          >
            05 · results
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            className="mt-2 font-mono text-2xl leading-snug font-bold text-[#d5dde3] sm:text-3xl"
          >
            Three real tickets. Reviewed end to end.
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mt-4 max-w-lg text-[14px] leading-6 text-[#7a848c]"
          >
            Engine ran each of these against a real repo, unattended, and opened a real PR. A second pass — code
            quality and process review, separately — graded what shipped and how it got there.
          </motion.p>
        </section>

        <section className="divide-y divide-white/10 border-b border-white/10">
          {reports.map((report, i) => {
            const tone = recommendationTone(report);
            return (
              <Reveal key={report.slug} delay={i * 0.05}>
                <a
                  href={`/engine/results/${report.slug}`}
                  className="group flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                >
                  <div>
                    <p className="font-mono text-[15px] text-[#d5dde3] group-hover:text-[#ff5c33]">{report.repo}</p>
                    <p className="mt-1 max-w-md text-[13px] leading-6 text-[#7a848c]">{report.taskTitle}</p>
                  </div>
                  <div className="flex items-center gap-3 sm:shrink-0">
                    <span className="font-mono text-[11px] uppercase tracking-[0.06em]" style={{ color: tone.color }}>
                      {tone.label}
                    </span>
                    <ArrowRight className="size-3.5 shrink-0 text-[#7a848c] transition-transform group-hover:translate-x-1 group-hover:text-[#ff5c33]" />
                  </div>
                </a>
              </Reveal>
            );
          })}
        </section>

        <section className="border-b border-white/10 py-10">
          <p className="font-mono text-[13px] font-bold text-[#d5dde3]">Run cost, side by side.</p>
          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            {metrics.map((metric) => {
              const values = reports.map((r) => metric.get(r));
              const max = Math.max(...values, 1);
              return (
                <div key={metric.label}>
                  <p className="font-mono text-[11px] tracking-[0.1em] text-[#7a848c] uppercase">{metric.label}</p>
                  <div className="mt-3 space-y-2">
                    {reports.map((report, i) => (
                      <div key={report.slug} className="flex items-center gap-3 text-[12px]">
                        <span className="w-28 shrink-0 truncate font-mono text-[#7a848c]">
                          {repoShort(report.repo)}
                        </span>
                        <span className="h-2 flex-1 bg-white/5">
                          <span
                            className="block h-full"
                            style={{
                              width: `${(values[i] / max) * 100}%`,
                              background: report.slug === "codeloom-engine" ? "#ff5c33" : report.slug === "tracer" ? "#22d3ee" : "#f2c14e",
                            }}
                          />
                        </span>
                        <span className="w-14 shrink-0 text-right font-mono text-[#d5dde3]">
                          {metric.format(values[i])}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-8 font-mono text-[11px] tracking-[0.1em] text-[#7a848c] uppercase">
            Findings by severity, across all 6 reviews
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(severityTally(reports)).map(([severity, count]) => (
              <span
                key={severity}
                className="border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.04em]"
                style={{ borderColor: `${severityColor[severity]}55`, color: severityColor[severity] }}
              >
                {severity} <b>{count}</b>
              </span>
            ))}
          </div>
        </section>

        <section className="py-10">
          <p className="font-mono text-[13px] font-bold text-[#d5dde3]">How these were graded.</p>
          <p className="mt-2 max-w-xl text-[13px] leading-6 text-[#7a848c]">
            Two independent reviews per run: a code quality pass over the actual diff, and a process pass over the
            full agent trace — tool calls, navigation, judge flags, read-before-edit discipline. Neither review sees
            the other's verdict.
          </p>
        </section>
      </main>

      <SiteFooter product={product} />
    </ProductShell>
  );
}
