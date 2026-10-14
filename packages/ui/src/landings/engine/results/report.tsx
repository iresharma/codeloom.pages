"use client";

import { PRODUCTS } from "@codeloom/config";
import { SiteFooter } from "../../../chrome/footer";
import { SiteNav } from "../../../chrome/site-nav";
import { EngineSubNav } from "../../../chrome/engine-subnav";
import { ProductShell } from "../../../components/product-shell";
import { DecisionFlowGraph } from "./decision-flow";
import { Stat, chartColors, panelClass, titleClass } from "./charts";
import { reportSummaries } from "./report-summary";
import type {
  EngineResultReport as Report,
  FlowPhase,
  ReportFinding,
  Severity,
} from "./types";

const severityColor: Record<Severity, string> = {
  critical: "#f28c79",
  high: "#f28c79",
  medium: "#e2bd6b",
  low: "#7eb5d0",
};
const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5c33]";

function Finding({ finding }: { finding: ReportFinding }) {
  return (
    <details className="border-b border-white/10 py-2">
      <summary
        className={`min-h-11 cursor-pointer py-3 text-sm leading-6 text-[#c3cbd1] ${focus}`}
      >
        <span
          className="mr-3 font-mono text-xs uppercase"
          style={{ color: severityColor[finding.severity] }}
        >
          {finding.severity}
        </span>
        {finding.summary}
      </summary>
      <div className="space-y-3 pb-4 text-xs leading-6 text-[#9ba6af]">
        {finding.file && (
          <p className="break-all font-mono text-[#7eb5d0]">
            {finding.file}
            {finding.line ? `:${finding.line}` : ""}
          </p>
        )}
        <p>{finding.detail}</p>
        {finding.suggestedFix && (
          <p>
            <b className="text-[#d5dde3]">Suggested fix: </b>
            {finding.suggestedFix}
          </p>
        )}
      </div>
    </details>
  );
}

function Phase({ phase }: { phase: FlowPhase }) {
  return (
    <div className={panelClass}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className={titleClass}>
          {phase.profile}{" "}
          <span className="text-[#9ba6af]">· {phase.agentId}</span>
        </h3>
        <span className="font-mono text-xs text-[#7eb5d0]">{phase.status}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat value={`$${phase.costUsd.toFixed(3)}`} label="Agent cost" />
        <Stat value={phase.toolCalls} label="Tool calls" />
        <Stat value={phase.tokens.toLocaleString("en-US")} label="Tokens" />
        <Stat value={phase.judgeFlags} label="Judge flags" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {phase.topTools.map((t) => (
          <span
            className="border border-white/10 px-2 py-1 text-xs text-[#9ba6af]"
            key={t.name}
          >
            {t.name} <b className="text-[#d5dde3]">{t.count}</b>
          </span>
        ))}
      </div>
      <details className="mt-3 text-xs leading-6 text-[#9ba6af]">
        <summary
          className={`min-h-11 cursor-pointer py-3 text-[#7eb5d0] ${focus}`}
        >
          Assigned task & recorded outcome
        </summary>
        <p>{phase.why}</p>
        <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap break-words font-mono">
          {phase.outcome || "No outcome summary recorded."}
        </pre>
        {phase.leftover && (
          <p className="mt-3">
            <b className="text-[#d5dde3]">Open questions: </b>
            {phase.leftover}
          </p>
        )}
      </details>
      <p className="text-xs leading-6 text-[#9ba6af]">
        Individual call arguments/results were not published for this historical
        run.
      </p>
    </div>
  );
}

export function EngineResultReport({ report }: { report: Report }) {
  const summary = reportSummaries[report.slug];
  const phaseTools = report.decisionFlow.phases.reduce(
    (n, p) => n + p.toolCalls,
    0,
  );
  return (
    <ProductShell product={PRODUCTS.engine} className="bg-[#0c1014]">
      <SiteNav active="engine" />
      <EngineSubNav active="results" />
      <main className="mx-auto max-w-6xl px-5 md:px-8">
        <header className="border-b border-white/10 py-10">
          <a
            href="/engine/results"
            className={`inline-flex min-h-11 items-center text-xs text-[#7eb5d0] ${focus}`}
          >
            ← All results
          </a>
          <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs">
            <span className="border border-white/15 px-3 py-2 text-[#9ba6af]">
              Old harness · archived case study
            </span>
            <span className="border border-white/15 px-3 py-2 text-[#e2bd6b]">
              {report.overallAssessment.recommendation.replaceAll("-", " ")}
            </span>
          </div>
          <h1 className="mt-5 break-words font-mono text-2xl text-[#d5dde3] md:text-3xl">
            {report.repo}
          </h1>
          <p className="mt-3 text-sm text-[#c3cbd1]">{report.taskTitle}</p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#d5dde3]">
            {summary?.takeaway ?? report.taskTitle}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              ["#run-map", "Agent map"],
              ["#review", "Review findings"],
              [report.links.diffUrl, "View diff ↗"],
              [report.prUrl, `PR #${report.prNumber} ↗`],
            ].map(([url, label]) => (
              <a
                key={url}
                href={url}
                className={`inline-flex min-h-11 items-center border border-white/15 px-4 text-xs text-[#7eb5d0] hover:border-[#ff5c33] ${focus}`}
              >
                {label}
              </a>
            ))}
          </div>
          <details className="mt-3 text-xs leading-6 text-[#9ba6af]">
            <summary className={`min-h-11 cursor-pointer py-3 ${focus}`}>
              Full task brief
            </summary>
            <p>{report.taskSummary}</p>
            <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap break-words font-mono">
              {report.taskPrompt}
            </pre>
          </details>
        </header>
        <section
          aria-label="Run totals"
          className="grid grid-cols-2 gap-3 py-6 md:grid-cols-4"
        >
          <Stat
            value={`$${report.stats.costUsd.toFixed(2)}`}
            label="Reported inference cost"
          />
          <Stat
            value={`${Math.round(report.stats.elapsedSeconds)}s`}
            label="Reported elapsed"
          />
          <Stat value={report.stats.toolCalls} label="Reported tool total" />
          <Stat
            value={report.decisionFlow.phases.length}
            label="Recorded agent phases"
          />
        </section>
        <section
          id="run-map"
          className="scroll-mt-24 border-b border-white/10 py-8"
        >
          <h2 className={titleClass}>Agent map</h2>
          <p className="mt-2 text-xs leading-6 text-[#9ba6af]">
            Select a phase to inspect its task, outcome and tools. Reconstructed
            from phase summaries; no timestamped call trace was published.
          </p>
          <div className="mt-5">
            <DecisionFlowGraph
              report={report}
              renderPhase={(p) => <Phase phase={p} />}
            />
          </div>
          {phaseTools !== report.stats.toolCalls && (
            <details className="mt-4 text-xs leading-6 text-[#9ba6af]">
              <summary
                className={`min-h-11 cursor-pointer py-3 text-[#e2bd6b] ${focus}`}
              >
                Count discrepancy in source report
              </summary>
              <p>
                Agent-phase tool counts sum to {phaseTools}; the run summary
                reports {report.stats.toolCalls}. Their aggregation scopes are
                not documented. Both are preserved rather than treated as
                interchangeable.
              </p>
            </details>
          )}
        </section>
        <section className="grid gap-6 border-b border-white/10 py-6 sm:grid-cols-2">
          {[
            {
              label: "What worked",
              items: summary?.strengths ?? [],
              color: chartColors[2],
            },
            {
              label: "What needs attention",
              items: summary?.concerns ?? [],
              color: chartColors[3],
            },
          ].map((group) => (
            <div key={group.label}>
              <h2 className={titleClass} style={{ color: group.color }}>
                {group.label}
              </h2>
              <ul className="mt-4 space-y-3">
                {group.items.map((item) => (
                  <li
                    className="border-l-2 pl-3 text-sm leading-6 text-[#c3cbd1]"
                    style={{ borderColor: group.color }}
                    key={item}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
        <section
          id="review"
          className="scroll-mt-24 border-b border-white/10 py-8"
        >
          <h2 className={titleClass}>Review evidence</h2>
          <p className="mt-2 text-xs leading-6 text-[#9ba6af]">
            Expand a review for findings, locations and suggested fixes. These
            qualitative reviews are separate from benchmark grading.
          </p>
          <div className="mt-5 space-y-3">
            <details className={panelClass}>
              <summary
                className={`min-h-11 cursor-pointer py-3 text-sm text-[#d5dde3] ${focus}`}
              >
                Code review · {report.codeReview.verdict} ·{" "}
                {report.codeReview.findings.length} findings
              </summary>
              <div className="mt-2">
                {report.codeReview.findings.map((f) => (
                  <Finding key={f.id} finding={f} />
                ))}
                <details className="mt-4 text-xs leading-6 text-[#9ba6af]">
                  <summary className="min-h-11 cursor-pointer py-3">
                    Original code-review narrative
                  </summary>
                  <p>{report.codeReview.summary}</p>
                </details>
              </div>
            </details>
            <details className={panelClass}>
              <summary
                className={`min-h-11 cursor-pointer py-3 text-sm text-[#d5dde3] ${focus}`}
              >
                Process review · {report.processReview.verdict} ·{" "}
                {report.processReview.findings.length} findings
              </summary>
              <p className="mt-3 text-xs text-[#9ba6af]">
                Navigation hierarchy:{" "}
                {report.processReview.followedNavigationHierarchy
                  ? "followed"
                  : "not followed"}{" "}
                · Read-before-edit violations:{" "}
                {report.processReview.readBeforeEditViolations}
              </p>
              {report.processReview.findings.map((f) => (
                <Finding key={f.id} finding={f} />
              ))}
              <details className="mt-4 text-xs leading-6 text-[#9ba6af]">
                <summary className="min-h-11 cursor-pointer py-3">
                  Original process-review narrative
                </summary>
                <p>{report.processReview.summary}</p>
              </details>
            </details>
            <details className={panelClass}>
              <summary
                className={`min-h-11 cursor-pointer py-3 text-sm text-[#d5dde3] ${focus}`}
              >
                Original overall assessment
              </summary>
              <p className="mt-3 text-sm leading-7 text-[#9ba6af]">
                {report.overallAssessment.narrative}
              </p>
              {[
                {
                  label: "Strengths",
                  items: report.overallAssessment.strengths,
                },
                { label: "Concerns", items: report.overallAssessment.concerns },
              ].map((g) => (
                <div key={g.label}>
                  <h3 className="mt-4 text-xs text-[#d5dde3]">{g.label}</h3>
                  <ul className="mt-2 list-disc space-y-2 pl-5 text-xs leading-6 text-[#9ba6af]">
                    {g.items.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </details>
          </div>
        </section>
        <footer className="flex flex-wrap gap-5 py-8 text-xs text-[#7eb5d0]">
          <a
            className={`inline-flex min-h-11 items-center ${focus}`}
            href={report.links.prUrl}
          >
            Pull request ↗
          </a>
          <a
            className={`inline-flex min-h-11 items-center ${focus}`}
            href={report.links.diffUrl}
          >
            Diff ↗
          </a>
          <a
            className={`inline-flex min-h-11 items-center ${focus}`}
            href={report.links.repoUrl}
          >
            Repository ↗
          </a>
          <span className="self-center text-[#9ba6af]">
            {report.stats.turns} turns ·{" "}
            {report.stats.totalTokens.toLocaleString("en-US")} reported tokens
          </span>
        </footer>
      </main>
      <SiteFooter product={PRODUCTS.engine} />
    </ProductShell>
  );
}
