"use client";

import { PRODUCTS } from "@codeloom/config";
import { motion, useReducedMotion } from "motion/react";

import { SiteFooter } from "../../../chrome/footer";
import { SiteNav } from "../../../chrome/site-nav";
import { EngineSubNav } from "../../../chrome/engine-subnav";
import { ProductShell } from "../../../components/product-shell";
import { Reveal } from "../../../magic/reveal";
import { DecisionFlowGraph } from "./decision-flow";
import { codeQualityTone, recommendationTone } from "./severity";
import type { EngineResultReport, FlowPhase, ReportFinding, Severity } from "./types";

const product = PRODUCTS.engine;

const severityColor: Record<Severity, string> = {
  critical: "#ef4444",
  high: "#ef4444",
  medium: "#f2c14e",
  low: "#7a848c",
};

const verdictTone: Record<string, { color: string; label: string }> = {
  approved: { color: "#34d399", label: "approved" },
  acceptable: { color: "#34d399", label: "acceptable" },
  efficient: { color: "#34d399", label: "efficient" },
  merge: { color: "#34d399", label: "merge" },
  "merge-ready": { color: "#34d399", label: "merge-ready" },
  "needs-changes": { color: "#f2c14e", label: "needs changes" },
  "request-changes": { color: "#f2c14e", label: "request changes" },
  concerning: { color: "#f2c14e", label: "concerning" },
  rejected: { color: "#ef4444", label: "rejected" },
  blocked: { color: "#ef4444", label: "blocked" },
};

function ToneBadge({ tone }: { tone: { color: string; label: string } }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.06em]"
      style={{ borderColor: `${tone.color}55`, color: tone.color, background: `${tone.color}14` }}
    >
      <span className="size-1.5 rounded-full" style={{ background: tone.color }} />
      {tone.label}
    </span>
  );
}

function VerdictBadge({ verdict }: { verdict: string }) {
  return <ToneBadge tone={verdictTone[verdict] ?? { color: "#7a848c", label: verdict }} />;
}

const statusColor: Record<string, string> = {
  ok: "#34d399",
  approve: "#34d399",
  failed: "#ef4444",
  error: "#ef4444",
};

function FlowCard({ phase }: { phase: FlowPhase }) {
  const color = statusColor[phase.status] ?? "#7a848c";
  return (
    <div className="relative border border-white/10 border-l-2 p-4" style={{ borderLeftColor: color }}>
      <div className="flex flex-wrap items-center gap-2 font-mono text-[12px]">
        <span className="font-bold text-[#d5dde3] uppercase">{phase.profile}</span>
        <span className="text-[#7a848c]">{phase.agentId}</span>
        <span className="uppercase" style={{ color }}>
          {phase.status || "running"}
        </span>
        <span className="ml-auto flex gap-2 text-[11px] text-[#7a848c]">
          <span>${phase.costUsd.toFixed(4)}</span>
          <span>{phase.tokens.toLocaleString("en-US")} tok</span>
          <span>{phase.toolCalls} tools</span>
        </span>
      </div>
      <p className="mt-2 text-[12.5px] leading-6 text-[#7a848c] italic">{phase.why}</p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {phase.topTools.map((tool) => (
          <span key={tool.name} className="border border-white/10 px-1.5 py-0.5 font-mono text-[10.5px] text-[#7a848c]">
            {tool.name} <b className="text-[#d5dde3]">{tool.count}</b>
          </span>
        ))}
        {phase.judgeFlags > 0 ? (
          <span className="border px-1.5 py-0.5 font-mono text-[10.5px]" style={{ borderColor: "#f2c14e55", color: "#f2c14e" }}>
            {phase.judgeFlags} judge flag{phase.judgeFlags === 1 ? "" : "s"}
          </span>
        ) : null}
      </div>
      {phase.outcome ? (
        <details className="group mt-2.5">
          <summary className="cursor-pointer font-mono text-[11px] text-[#7a848c] hover:text-[#d5dde3]">
            what it found / did
          </summary>
          <pre className="mt-2 max-h-72 overflow-y-auto border border-white/10 bg-[#0a0d10] p-3 font-mono text-[11.5px] leading-6 whitespace-pre-wrap text-[#7a848c]">
            {phase.outcome}
          </pre>
        </details>
      ) : null}
      {phase.leftover ? (
        <details className="group mt-2">
          <summary className="cursor-pointer font-mono text-[11px] text-[#7a848c] hover:text-[#d5dde3]">
            leftover questions
          </summary>
          <pre className="mt-2 max-h-72 overflow-y-auto border border-white/10 bg-[#0a0d10] p-3 font-mono text-[11.5px] leading-6 whitespace-pre-wrap text-[#7a848c]">
            {phase.leftover}
          </pre>
        </details>
      ) : null}
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 px-4 py-3">
      <p className="font-mono text-[16px] font-bold text-[#d5dde3]">{value}</p>
      <p className="mt-1 font-mono text-[11px] tracking-[0.06em] text-[#7a848c] uppercase">{label}</p>
    </div>
  );
}

function FindingCard({ finding }: { finding: ReportFinding }) {
  const color = severityColor[finding.severity];
  return (
    <div className="border border-white/10 border-l-2 p-4" style={{ borderLeftColor: color }}>
      <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
        <span className="size-1.5 rounded-full" style={{ background: color }} />
        <span className="uppercase tracking-[0.06em]" style={{ color }}>
          {finding.severity}
        </span>
        <span className="text-[#7a848c]">{finding.category}</span>
        {finding.profile ? (
          <span className="text-[#7a848c]">
            · {finding.profile}
            {finding.agentId ? ` (${finding.agentId})` : ""}
          </span>
        ) : null}
        {finding.file ? (
          <span className="ml-auto text-[#7a848c]">
            {finding.file}
            {finding.line ? `:${finding.line}` : ""}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-[13px] leading-6 text-[#d5dde3]">{finding.summary}</p>
      <details className="group mt-2">
        <summary className="cursor-pointer font-mono text-[11px] text-[#7a848c] hover:text-[#d5dde3]">
          detail
        </summary>
        <p className="mt-2 text-[12.5px] leading-6 text-[#7a848c]">{finding.detail}</p>
        {finding.suggestedFix ? (
          <p className="mt-2 text-[12.5px] leading-6 text-[#7a848c]">
            <span className="text-[#d5dde3]">suggested fix — </span>
            {finding.suggestedFix}
          </p>
        ) : null}
      </details>
    </div>
  );
}

export function EngineResultReport({ report }: { report: EngineResultReport }) {
  const reduce = useReducedMotion();
  const tone = recommendationTone(report);
  const cqTone = codeQualityTone(report);
  const procTone = verdictTone[report.processReview.verdict] ?? { color: "#7a848c", label: report.processReview.verdict };

  return (
    <ProductShell product={product} className="bg-[#0c1014]">
      <SiteNav active="engine" />
      <EngineSubNav active="results" />

      <main className="mx-auto max-w-5xl px-5 md:px-8 xl:max-w-6xl">
        <section className="border-b border-white/10 py-10 md:py-14">
          <a href="/engine/results" className="font-mono text-[12px] text-[#7a848c] hover:text-[#d5dde3]">
            ← results
          </a>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-3 font-mono text-xl leading-snug font-bold text-[#d5dde3] sm:text-2xl"
          >
            {report.repo}
          </motion.h1>
          <p className="mt-2 text-[14px] leading-6 text-[#d5dde3]">{report.taskTitle}</p>
          <p className="mt-2 max-w-xl text-[13px] leading-6 text-[#7a848c]">{report.taskSummary}</p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <ToneBadge tone={{ label: `overall · ${tone.label}`, color: tone.color }} />
            <ToneBadge tone={{ label: `code · ${cqTone.label}`, color: cqTone.color }} />
            <ToneBadge tone={{ label: `process · ${procTone.label}`, color: procTone.color }} />
            <a
              href={report.prUrl}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[12px] text-[#ff5c33] underline underline-offset-4"
            >
              PR #{report.prNumber}
            </a>
          </div>

          <details className="group mt-5">
            <summary className="cursor-pointer font-mono text-[12px] text-[#7a848c] hover:text-[#d5dde3]">
              full task prompt
            </summary>
            <pre className="mt-3 max-w-2xl overflow-x-auto border border-white/10 bg-[#0a0d10] p-3 font-mono text-[12px] leading-6 whitespace-pre-wrap text-[#7a848c]">
              {report.taskPrompt}
            </pre>
          </details>
        </section>

        <section className="border-b border-white/10 py-8">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <StatTile label="cost" value={`$${report.stats.costUsd.toFixed(2)}`} />
            <StatTile label="tokens" value={report.stats.totalTokens.toLocaleString("en-US")} />
            <StatTile label="turns" value={String(report.stats.turns)} />
            <StatTile label="tool calls" value={String(report.stats.toolCalls)} />
          </div>
          <p className="mt-3 font-mono text-[11.5px] text-[#7a848c]">
            {report.stats.elapsedSeconds.toFixed(0)}s · agents spawned: {report.stats.agentProfiles.join(", ")}
          </p>
          <p className="mt-2 font-mono text-[11.5px] text-[#7a848c]">
            {report.verification.language} · builds: {report.verification.builds ? "yes" : "no"} · tests:{" "}
            {report.verification.hasTests ? (report.verification.testsPass ? "pass" : "fail") : "none"}
          </p>
        </section>

        <section className="border-b border-white/10 py-10">
          <p className="font-mono text-[13px] font-bold text-[#d5dde3]">
            How it got here <span className="text-[#7a848c]">— decision flow, spawn-by-spawn</span>
          </p>
          <Reveal className="mt-5">
            <DecisionFlowGraph report={report} renderPhase={(phase) => <FlowCard phase={phase} />} />
          </Reveal>
        </section>

        <section className="border-b border-white/10 py-10">
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-mono text-[13px] font-bold text-[#d5dde3]">Overall assessment</p>
            <ToneBadge tone={tone} />
          </div>
          <blockquote
            className="mt-4 border-l-2 bg-white/[0.02] py-3 pl-4 text-[13px] leading-6 text-[#d5dde3]"
            style={{ borderLeftColor: tone.color }}
          >
            {report.overallAssessment.narrative}
          </blockquote>

          <div className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">
            <div>
              <p className="flex items-center gap-2 font-mono text-[11px] font-bold text-[#34d399] uppercase tracking-[0.08em]">
                <span className="flex size-4 items-center justify-center rounded-full bg-[#34d399]/15 text-[10px]">✓</span>
                Strengths
              </p>
              <ul className="mt-3 space-y-3">
                {report.overallAssessment.strengths.map((item, i) => (
                  <li key={i} className="border-l-2 border-[#34d399]/30 pl-3 text-[12.5px] leading-6 text-[#7a848c]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="flex items-center gap-2 font-mono text-[11px] font-bold text-[#f2c14e] uppercase tracking-[0.08em]">
                <span className="flex size-4 items-center justify-center rounded-full bg-[#f2c14e]/15 text-[10px]">!</span>
                Concerns
              </p>
              <ul className="mt-3 space-y-3">
                {report.overallAssessment.concerns.map((item, i) => (
                  <li key={i} className="border-l-2 border-[#f2c14e]/30 pl-3 text-[12.5px] leading-6 text-[#7a848c]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 py-10">
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-mono text-[13px] font-bold text-[#d5dde3]">
              Code quality review <span className="text-[#7a848c]">({report.codeReview.findings.length})</span>
            </p>
            <ToneBadge tone={cqTone} />
          </div>
          <p className="mt-2 max-w-xl text-[13px] leading-6 text-[#7a848c]">{report.codeReview.summary}</p>
          <div className="mt-5 space-y-3">
            {report.codeReview.findings.map((finding, i) => (
              <Reveal key={finding.id} delay={i * 0.03}>
                <FindingCard finding={finding} />
              </Reveal>
            ))}
          </div>
        </section>

        <section className="border-b border-white/10 py-10">
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-mono text-[13px] font-bold text-[#d5dde3]">
              Process review <span className="text-[#7a848c]">({report.processReview.findings.length})</span>
            </p>
            <VerdictBadge verdict={report.processReview.verdict} />
          </div>
          <p className="mt-2 max-w-xl text-[13px] leading-6 text-[#7a848c]">{report.processReview.summary}</p>
          <p className="mt-2 font-mono text-[11.5px] text-[#7a848c]">
            navigation hierarchy followed: {report.processReview.followedNavigationHierarchy ? "yes" : "no"} ·
            read-before-edit violations: {report.processReview.readBeforeEditViolations}
          </p>
          <div className="mt-5 space-y-3">
            {report.processReview.findings.map((finding, i) => (
              <Reveal key={finding.id} delay={i * 0.03}>
                <FindingCard finding={finding} />
              </Reveal>
            ))}
          </div>
        </section>

        <section className="flex flex-wrap items-center gap-x-6 gap-y-2 py-8 font-mono text-[12px] text-[#7a848c]">
          <a href={report.links.prUrl} target="_blank" rel="noreferrer" className="hover:text-[#ff5c33]">
            pull request
          </a>
          <a href={report.links.diffUrl} target="_blank" rel="noreferrer" className="hover:text-[#ff5c33]">
            diff
          </a>
          <a href={report.links.repoUrl} target="_blank" rel="noreferrer" className="hover:text-[#ff5c33]">
            repo
          </a>
        </section>
      </main>

      <SiteFooter product={product} />
    </ProductShell>
  );
}
