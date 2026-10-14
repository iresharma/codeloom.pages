"use client";

import { PRODUCTS } from "@codeloom/config";
import { ArrowRight } from "lucide-react";
import { BenchmarkPanel } from "./benchmark-panel";
import { BarChart, panelClass, titleClass } from "./charts";
import { reportSummaries } from "./report-summary";

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

const reports: EngineResultReport[] = [
  codeloomEngineReport,
  reachAuthProxyReport,
  tracerReport,
];

export function EngineResultsIndexLanding() {
  return (
    <ProductShell product={product} className="bg-[#0c1014]">
      <SiteNav active="engine" />
      <EngineSubNav active="results" />

      <main className="mx-auto max-w-5xl px-5 md:px-8 xl:max-w-6xl">
        <BenchmarkPanel />
        <section className="pt-10">
          <h2 className="font-mono text-sm font-semibold text-[#d5dde3]">
            Earlier repository case studies
          </h2>
          <p className="mt-2 text-xs leading-6 text-[#9ba6af]">
            Three historical runs. Original reported metrics; no controlled
            comparison.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className={panelClass}>
              <h3 className={titleClass}>Reported cost by case</h3>
              <div className="mt-5">
                <BarChart
                  items={reports.map((r) => ({
                    label: r.repo.split("/").at(-1)!,
                    value: r.stats.costUsd,
                  }))}
                  format={(n) => `$${n.toFixed(2)}`}
                  caption="Different tasks and run conditions. These costs do not rank the systems."
                />
              </div>
            </div>
            <div className={panelClass}>
              <h3 className={titleClass}>Reported tool activity</h3>
              <div className="mt-5">
                <BarChart
                  items={reports.map((r) => ({
                    label: r.repo.split("/").at(-1)!,
                    value: r.stats.toolCalls,
                  }))}
                  caption="Run-summary totals. Agent-phase totals can use a different, undocumented scope."
                />
              </div>
            </div>
          </div>
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
                    <p className="font-mono text-[15px] text-[#d5dde3] group-hover:text-[#ff5c33]">
                      {report.repo}
                    </p>
                    <p className="mt-1 max-w-md text-[13px] leading-6 text-[#7a848c]">
                      {reportSummaries[report.slug]?.takeaway ??
                        report.taskTitle}
                    </p>
                    <p className="mt-2 font-mono text-xs text-[#9ba6af]">
                      ${report.stats.costUsd.toFixed(2)} ·{" "}
                      {Math.round(report.stats.elapsedSeconds)}s ·{" "}
                      {report.decisionFlow.phases.length} agent phases
                    </p>
                  </div>
                  <div className="flex items-center gap-3 sm:shrink-0">
                    <span
                      className="font-mono text-[11px] uppercase tracking-[0.06em]"
                      style={{ color: tone.color }}
                    >
                      {report.overallAssessment.recommendation.replaceAll(
                        "-",
                        " ",
                      )}
                    </span>
                    <ArrowRight className="size-3.5 shrink-0 text-[#7a848c] transition-transform group-hover:translate-x-1 group-hover:text-[#ff5c33]" />
                  </div>
                </a>
              </Reveal>
            );
          })}
        </section>

        <details className="py-6 text-xs leading-6 text-[#9ba6af]">
          <summary className="min-h-11 cursor-pointer py-3 text-[#7eb5d0]">
            How the historical cases were reviewed
          </summary>
          <p className="font-mono text-[13px] font-bold text-[#d5dde3]">
            How these were graded.
          </p>
          <p className="mt-2 max-w-xl text-[13px] leading-6 text-[#7a848c]">
            Two independent reviews per run: a code quality pass over the actual
            diff, and a process pass over the full agent trace — tool calls,
            navigation, judge flags, read-before-edit discipline. Neither review
            sees the other's verdict.
          </p>
        </details>
      </main>

      <SiteFooter product={product} />
    </ProductShell>
  );
}
