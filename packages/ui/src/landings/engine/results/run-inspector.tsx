"use client";

import { useMemo, useState } from "react";
import { PRODUCTS } from "@codeloom/config";
import { SiteNav } from "../../../chrome/site-nav";
import { EngineSubNav } from "../../../chrome/engine-subnav";
import { SiteFooter } from "../../../chrome/footer";
import { ProductShell } from "../../../components/product-shell";
import { Stat, panelClass, titleClass, chartColors } from "./charts";
import { RunTimeline } from "./run-timeline";
import { RunRequests } from "./run-requests";
import { RunAgents } from "./run-agents";
import { GitDiff } from "./git-diff";
import { parseGitDiff } from "./git-diff-parser";
import { buttonClass, focusClass, Payload, elapsed, money } from "./run-ui";
import type { RunView } from "./run-types";
export type { RunView } from "./run-types";

export function RunInspector({
  run,
  artifactBase,
}: {
  run: RunView;
  artifactBase: string;
}) {
  const [tab, setTab] = useState("Timeline");
  const [agent, setAgent] = useState("all");
  const tools = useMemo(() => {
    const counts = new Map<string, number>();
    for (const a of run.agents)
      for (const t of a.tools)
        counts.set(t.name, (counts.get(t.name) ?? 0) + t.count);
    return [...counts].sort((a, b) => b[1] - a[1]);
  }, [run.agents]);
  const patch = useMemo(() => parseGitDiff(run.patch), [run.patch]);
  const prompt = run.timeline.find(
    (e) =>
      e.kind === "message" &&
      e.title === "user" &&
      e.agent_id === "root" &&
      e.detail &&
      e.detail !== "null",
  )?.detail;
  const trusted = run.checks.filter((c) => c.kind === "trusted");
  const hidden = run.checks.filter((c) => c.kind === "hidden");
  const infra = [
    "provider_error",
    "transport_error",
    "host_error",
    "infra_unresolved",
  ].includes(run.termination);
  const outcome = run.synthetic
    ? "Expected no-op failure"
    : infra
      ? "Unresolved infrastructure"
      : run.passed
        ? "Passed required checks"
        : "Did not pass";
  const outcomeColor =
    run.synthetic || infra
      ? "text-[#e2bd6b]"
      : run.passed
        ? "text-[#8ccf9f]"
        : "text-[#f28c79]";
  const outcomes = [
    ["Grading", outcome],
    ["Attempt elapsed", elapsed(run.elapsed_s)],
    [
      "Upstream checks",
      `${trusted.filter((c) => c.passed).length} / ${trusted.length} passed`,
    ],
    [
      "Hidden checks",
      hidden.length
        ? `${hidden.filter((c) => c.passed).length} / ${hidden.length} passed`
        : "Not recorded",
    ],
    ["Files changed", patch.length],
    [
      "Patch",
      `+${patch.reduce((n, f) => n + f.additions, 0)} / −${patch.reduce((n, f) => n + f.deletions, 0)}`,
    ],
    ["Model requests", run.requests.length],
    ["Termination", run.termination.replaceAll("_", " ")],
    ["Inference charge", money(run.cost_usd)],
    [
      "Trace coverage",
      run.trace_available ? "Native trace available" : "Trace unavailable",
    ],
  ];
  const product = PRODUCTS.engine;
  return (
    <ProductShell product={product} className="bg-[#0c1014]">
      <SiteNav active="engine" />
      <EngineSubNav active="results" />
      <main className="mx-auto max-w-6xl px-5 pb-12 md:px-8">
        <header className="border-b border-white/10 py-8">
          <a
            className={`inline-flex min-h-11 items-center text-xs text-[#7eb5d0] ${focusClass}`}
            href="/engine/results"
          >
            ← All results
          </a>
          <div className="mt-3 flex flex-wrap gap-2 font-mono text-xs">
            <span className="border border-white/15 px-3 py-2 text-[#e2bd6b]">
              {run.synthetic
                ? "Synthetic integration check · not scored"
                : `${run.stage} attempt`}
            </span>
            <span className="border border-white/15 px-3 py-2 text-[#9ba6af]">
              {run.system}
            </span>
          </div>
          <h1 className="mt-4 break-words font-mono text-2xl text-[#d5dde3]">
            {run.task_id}{" "}
            <span className="text-[#ff5c33]">/ run inspector</span>
          </h1>
          <p className="mt-3 break-all font-mono text-xs text-[#9ba6af]">
            {run.id}
            {run.retry_of ? ` · recovery of ${run.retry_of}` : ""}
          </p>
          {run.synthetic && (
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#e2bd6b]">
              A scripted provider exercised the native adapters. No live model,
              no paid calls, and no coding-performance score. The unchanged task
              is expected to fail the hidden feature check.
            </p>
          )}
        </header>
        <div className="my-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Recorded requests" value={run.requests.length} />
          <Stat
            label="Recorded tool calls"
            value={tools.reduce((n, t) => n + t[1], 0)}
          />
          <Stat
            label="Spawned agents"
            value={run.agents.filter((a) => a.id !== "root").length}
          />
          <Stat
            label="Actual inference charge"
            value={run.cost_usd === null ? "Unavailable" : money(run.cost_usd)}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <section
            className={`${panelClass} flex h-[23rem] flex-col`}
            aria-label="Tools used"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className={titleClass}>Tools used</h2>
              <span className="font-mono text-xs text-[#9ba6af]">
                {tools.length} tools
              </span>
            </div>
            <div
              className={`mt-4 min-h-0 flex-1 overflow-auto pr-2 ${focusClass}`}
              role="region"
              aria-label="Tool usage counts"
              tabIndex={0}
            >
              {tools.length ? (
                <ul className="space-y-4">
                  {tools.map(([name, count], i) => (
                    <li key={name}>
                      <div className="mb-2 flex justify-between gap-3 font-mono text-xs text-[#c3cbd1]">
                        <span className="break-all">{name}</span>
                        <b>{count}</b>
                      </div>
                      <div className="h-1.5 bg-white/5">
                        <div
                          className="h-full"
                          style={{
                            width: `${(count / tools[0][1]) * 100}%`,
                            backgroundColor:
                              chartColors[i % chartColors.length],
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-4 text-xs text-[#9ba6af]">
                  No tool calls recorded.
                </p>
              )}
            </div>
            <p className="mt-4 text-xs leading-5 text-[#9ba6af]">
              Counts include failed calls recorded in native traces.
            </p>
          </section>
          <section
            className={`${panelClass} flex h-[23rem] flex-col`}
            aria-label="Run outcome"
          >
            <h2 className={titleClass}>Run outcome</h2>
            <dl
              className={`mt-4 grid min-h-0 grid-cols-2 gap-x-5 gap-y-4 overflow-auto text-xs ${focusClass}`}
              tabIndex={0}
            >
              {outcomes.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[#9ba6af]">{label}</dt>
                  <dd
                    className={`mt-1.5 break-words ${label === "Grading" ? outcomeColor : "text-[#d5dde3]"}`}
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
        <details
          open
          className="my-5 border border-white/10 bg-white/[0.02] px-5"
        >
          <summary
            className={`min-h-11 cursor-pointer py-3 font-mono text-xs text-[#d5dde3] ${focusClass}`}
          >
            Input prompt{" "}
            <span className="ml-3 font-sans text-[#9ba6af]">
              Original recorded user message
            </span>
          </summary>
          <pre className="mb-4 max-h-40 overflow-auto border-t border-white/10 pt-3 font-mono text-xs leading-6 whitespace-pre-wrap break-words text-[#c3cbd1]">
            {prompt ?? "No input prompt was recorded in the published trace."}
          </pre>
        </details>
        <nav
          aria-label="Run evidence views"
          className="my-5 flex flex-wrap gap-2"
        >
          {["Timeline", "Agents", "Requests", "Grading", "Diff"].map((t) => (
            <button
              type="button"
              key={t}
              aria-pressed={tab === t}
              onClick={() => setTab(t)}
              className={`${buttonClass} ${tab === t ? "border-[#ff5c33] bg-[#ff5c33]/10 text-[#ff5c33]" : ""}`}
            >
              {t}
              {t === "Timeline"
                ? ` (${run.timeline.length})`
                : t === "Agents"
                  ? ` (${run.agents.length})`
                  : t === "Requests"
                    ? ` (${run.requests.length})`
                    : ""}
            </button>
          ))}
        </nav>
        <section aria-label={`${tab} evidence`}>
          {tab === "Timeline" && (
            <RunTimeline run={run} agent={agent} onAgentChange={setAgent} />
          )}
          {tab === "Agents" && (
            <RunAgents
              run={run}
              onInspectTimeline={(id) => {
                setAgent(id);
                setTab("Timeline");
              }}
            />
          )}
          {tab === "Requests" && <RunRequests run={run} />}
          {tab === "Grading" && (
            <>
              <p className="mb-4 text-xs leading-6 text-[#9ba6af]">
                Executable checks determine the benchmark grade.{" "}
                <a
                  href="/engine/results#grading"
                  className="text-[#7eb5d0] underline"
                >
                  Grading rules
                </a>
              </p>
              <div className="space-y-3">
                {run.checks.map((c, i) => (
                  <article key={i} className={panelClass}>
                    <div className="flex flex-wrap justify-between gap-3">
                      <span className="font-mono text-xs text-[#9ba6af]">
                        {c.kind} · repeat {c.repeat + 1}
                      </span>
                      <span
                        className={`text-xs ${c.passed ? "text-[#8ccf9f]" : "text-[#f28c79]"}`}
                      >
                        {c.passed ? "Passed" : "Failed"}
                      </span>
                    </div>
                    <p className="my-3 break-words font-mono text-xs text-[#d5dde3]">
                      {c.command}
                    </p>
                    <Payload label="Check output" text={c.output} />
                  </article>
                ))}
              </div>
              <div className="mt-4">
                <Payload
                  label="Full grading evidence"
                  text={JSON.stringify(run.grading, null, 2)}
                />
              </div>
            </>
          )}
          {tab === "Diff" && <GitDiff patch={run.patch} />}
        </section>
        <footer className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-6">
          {[
            ["view.json", "Normalized trace JSON"],
            ["result.json", "Result JSON"],
            ["patch.diff", "Patch"],
          ].map(([file, label]) => (
            <a
              key={file}
              href={`${artifactBase}/${file}`}
              download
              className={buttonClass}
            >
              {label} ↓
            </a>
          ))}
        </footer>
      </main>
      <SiteFooter product={product} />
    </ProductShell>
  );
}
