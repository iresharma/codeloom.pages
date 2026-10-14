"use client";

import { useEffect, useMemo, useState } from "react";
import data from "./data/benchmark.json";
import {
  BenchmarkInsights,
  BenchmarkSetupNotes,
  RunCatalog,
} from "./benchmark-insights";
import { GradingGuide } from "./grading-guide";

type Outcome = "pass" | "fail" | "unresolved" | "unrun";
type Arm = {
  status: Outcome;
  termination: string | null;
  cost_usd: number | null;
  elapsed_s: number | null;
  attempt_id: string | null;
  artifact_path: string | null;
};
type System = {
  id: string;
  passed: number;
  evaluated: number;
  scheduled: number;
  unresolved: number;
  unrun: number;
  cost_usd: number | null;
  cost_per_success_usd: number | null;
  median_elapsed_s: number | null;
  budget_hits: number;
  watchdog_hits: number;
  regressions: number;
};
type Task = {
  id: string;
  repo: string;
  category: string;
  title: string;
  difficulty: string;
  attempt_limit_usd: number | null;
  language: string;
  provenance: string;
  systems: Record<string, Arm>;
};
type Summary = {
  run_id: string;
  status: "not_run" | "partial" | "complete";
  model: string;
  provider: string;
  reasoning_effort?: string;
  thinking_enabled?: boolean;
  task_count: number;
  difficulty_mix: Record<string, number>;
  repo_count: number;
  budget_usd: number;
  pairs: Record<string, number>;
  systems: System[];
  tasks: Task[];
  limitations: string[];
  calibration_status: string;
  preregistration_commit: string | null;
  blocked_reason?: string;
};
const benchmark = data as Summary;
const names: Record<string, string> = {
  "mini-swe-agent": "mini-SWE-agent",
  "engine-core": "Engine core",
};
const categories: Record<string, string> = {
  bug: "Bug fix",
  "cross-file": "Cross-file feature",
  navigation: "Code navigation",
  "test-generation": "Test generation",
};
const colors: Record<Outcome, string> = {
  pass: "#8ccf9f",
  fail: "#f28c79",
  unresolved: "#e2bd6b",
  unrun: "#7a848c",
};
const money = (n: number | null) => (n === null ? "—" : `$${n.toFixed(3)}`);
const time = (n: number | null) =>
  n === null ? "—" : `${Math.round(n / 60)} min`;
const label: Record<Outcome, string> = {
  pass: "Pass",
  fail: "Fail",
  unresolved: "Infrastructure",
  unrun: "Not run",
};
const download = `/benchmarks/${benchmark.run_id}`;

function Status({ arm }: { arm: Arm }) {
  return (
    <span
      className="font-mono text-xs"
      style={{ color: colors[arm.status] }}
      title={arm.termination ?? undefined}
    >
      {label[arm.status]}
    </span>
  );
}

export function BenchmarkPanel() {
  const [repo, setRepo] = useState("all");
  const [category, setCategory] = useState("all");
  const [outcome, setOutcome] = useState("all");
  const rows = useMemo(
    () =>
      benchmark.tasks.filter(
        (t) =>
          (repo === "all" || t.repo === repo) &&
          (category === "all" || t.category === category) &&
          (outcome === "all" ||
            Object.values(t.systems).some((a) => a.status === outcome)),
      ),
    [repo, category, outcome],
  );
  useEffect(() => {
    const target = window.location.hash.slice(1);
    if (["grading", "task-explorer", "system-results"].includes(target)) {
      const element = document.getElementById(target);
      if (element instanceof HTMLDetailsElement) element.open = true;
    }
  }, []);
  const measured = benchmark.status !== "not_run";
  const pairs = [
    { key: "engine_only", title: "Engine only", color: "#ff5c33" },
    { key: "mini_only", title: "mini only", color: "#7eb5d0" },
    { key: "both_pass", title: "Both passed", color: "#8ccf9f" },
    { key: "both_fail", title: "Both failed", color: "#f28c79" },
  ];
  const pairTotal = pairs.reduce((n, p) => n + benchmark.pairs[p.key], 0);
  const selectClass =
    "min-h-11 border border-white/15 bg-[#13191f] px-3 font-mono text-xs text-[#d5dde3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5c33]";
  return (
    <>
      <section
        className="border-b border-white/10 py-8 md:py-10"
        aria-labelledby="benchmark-title"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-xs tracking-widest text-[#7a848c] uppercase">
            05 · Results / paired benchmark
          </p>
          <span className="border border-white/15 px-3 py-1.5 font-mono text-[11px] text-[#e2bd6b]">
            {benchmark.status === "not_run"
              ? "Setup validation · not scored"
              : benchmark.status === "partial"
                ? "Partial run"
                : "Completed run"}
          </span>
        </div>
        <h1
          id="benchmark-title"
          className="mt-5 max-w-3xl font-mono text-3xl leading-tight font-semibold text-[#d5dde3] md:text-4xl"
        >
          Same tasks. Same model.
          <br />
          <span className="text-[#ff5c33]">Two coding systems.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-[#9ba6af]">
          Independent checkouts. Task-matched spending caps. Executable hidden checks.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-xs text-[#7eb5d0]">
          {[
            ["#task-explorer", "Explore tasks"],
            ["#runs", "Inspect runs"],
            ["#grading", "Grading rules"],
          ].map(([href, text]) => (
            <a
              key={href}
              className="inline-flex min-h-11 items-center border border-white/15 px-4 hover:border-[#ff5c33] focus-visible:outline-2 focus-visible:outline-[#ff5c33]"
              href={href}
              onClick={() => {
                const element = document.getElementById(href.slice(1));
                if (element instanceof HTMLDetailsElement) element.open = true;
              }}
            >
              {text} ↓
            </a>
          ))}
        </div>
        <dl className="mt-8 grid grid-cols-2 gap-px border border-white/10 bg-white/10 md:grid-cols-4">
          {[
            ["Tasks", benchmark.task_count],
            ["Repositories", benchmark.repo_count],
            ["Scheduled attempts", benchmark.task_count * 2],
            ["Total budget ceiling", `$${benchmark.budget_usd}`],
          ].map(([name, value]) => (
            <div key={name} className="bg-[#0c1014] p-5">
              <dt className="text-xs text-[#9ba6af]">{name}</dt>
              <dd className="mt-2 font-mono text-2xl text-[#d5dde3]">
                {value}
              </dd>
            </div>
          ))}
        </dl>
        {!measured && (
          <div className="mt-6 border-l-2 border-[#e2bd6b] bg-[#e2bd6b]/5 px-5 py-4 text-sm leading-6 text-[#c3cbd1]">
            <strong className="font-medium">
              Paid runs paused pending benchmark review.
            </strong>
            <p className="mt-1 text-xs">
              No scored results yet. Paid calibration and measurement require
              explicit approval.
            </p>
            <details className="mt-2 text-xs">
              <summary className="min-h-11 cursor-pointer py-3 text-[#7eb5d0]">
                Last recorded run gate
              </summary>
              {benchmark.blocked_reason ??
                "Setup validation is required before measurement."}
            </details>
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] text-[#9ba6af]">
          <span>{benchmark.model}</span>
          <span>{benchmark.provider}</span>
          <span>Thinking {benchmark.thinking_enabled ? "on" : "off"} · {benchmark.reasoning_effort}</span>
          <span>Classifier off</span>
          <span>One run per task · zero ablations</span>
          <span>{benchmark.difficulty_mix.light} light · {benchmark.difficulty_mix.medium} medium · {benchmark.difficulty_mix.heavy} heavy</span>
        </div>
      </section>

      <BenchmarkInsights />

      {measured && (
        <section
          className="border-b border-white/10 py-8"
          aria-label="Paired benchmark outcomes"
        >
          <div>
            <h2 className="font-mono text-sm font-semibold text-[#d5dde3]">
              Where the systems disagree
            </h2>
            <p className="mt-2 text-xs leading-6 text-[#9ba6af]">
              Paired outcomes lead the comparison. One vote per task.
            </p>
            <div
              className="mt-5 space-y-3"
              role="img"
              aria-label={
                measured
                  ? pairs
                      .map((p) => `${p.title}: ${benchmark.pairs[p.key]}`)
                      .join(", ")
                  : "Paired outcomes unavailable. No measured attempts."
              }
            >
              {pairs.map((p) => (
                <div
                  key={p.key}
                  className="grid grid-cols-[105px_1fr_24px] items-center gap-3 text-xs"
                >
                  <span className="text-[#9ba6af]">{p.title}</span>
                  <span className="h-3 bg-white/5">
                    <span
                      className="block h-full"
                      style={{
                        width: `${pairTotal ? (benchmark.pairs[p.key] / pairTotal) * 100 : 0}%`,
                        background: p.color,
                      }}
                    />
                  </span>
                  <span className="text-right font-mono text-[#d5dde3]">
                    {measured ? benchmark.pairs[p.key] : "—"}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-[#9ba6af]">
              {measured
                ? `${benchmark.pairs.unresolved} unresolved pairs · ${benchmark.pairs.unrun} unrun pairs`
                : "Awaiting scored task pairs"}
            </p>
          </div>
        </section>
      )}

      <details
        className="border-b border-white/10 py-3"
        id="system-results"
        open={measured}
      >
        <summary className="min-h-11 cursor-pointer py-3 font-mono text-sm text-[#d5dde3]">
          Comparison metrics
          {!measured && (
            <span className="ml-3 text-xs text-[#9ba6af]">
              Awaiting measured runs
            </span>
          )}
        </summary>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-xs">
            <caption className="sr-only">
              Comparison results. A dash means no measurement is available.
            </caption>
            <thead className="border-b border-white/15 font-mono text-[11px] text-[#9ba6af]">
              <tr>
                {[
                  "System",
                  "Pass / evaluated",
                  "Pass / scheduled",
                  "Total cost",
                  "Cost / success",
                  "Median elapsed",
                  "Regressions",
                ].map((h) => (
                  <th key={h} className="px-3 py-3 font-normal first:pl-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {benchmark.systems.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-white/5 text-[#d5dde3]"
                >
                  <th scope="row" className="py-4 pr-3 font-mono font-normal">
                    {names[s.id]}
                  </th>
                  <td className="px-3">
                    {measured ? `${s.passed} / ${s.evaluated}` : "—"}
                  </td>
                  <td className="px-3">
                    {measured
                      ? `${s.passed} / ${s.scheduled}`
                      : `Pending / ${s.scheduled}`}
                  </td>
                  <td className="px-3">{money(s.cost_usd)}</td>
                  <td className="px-3">{money(s.cost_per_success_usd)}</td>
                  <td className="px-3">{time(s.median_elapsed_s)}</td>
                  <td className="px-3">{measured ? s.regressions : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <details className="mt-4 max-w-3xl text-xs leading-6 text-[#9ba6af]">
          <summary className="min-h-11 cursor-pointer py-3 text-[#7eb5d0]">
            Denominators, retries and regressions
          </summary>
          Pass / scheduled keeps infrastructure outcomes in the denominator.
          Infrastructure failures follow a fixed retry policy. Both attempts
          count toward cost and elapsed time; unresolved failures leave the
          evaluated denominator and remain in delivery coverage. Agent failures,
          budget stops and regressions count as failures. Individual attempt maxima
          total $50 but share a $32 measurement envelope; remaining pairs can stay
          unrun when that envelope is exhausted. Regression counts
          track newly failing upstream check commands; failures already present
          in the starting snapshot are excluded.
        </details>
      </details>

      <details className="border-b border-white/10 py-3" id="task-explorer">
        <summary className="min-h-11 cursor-pointer py-3 font-mono text-sm text-[#d5dde3]">
          Task list{" "}
          <span className="ml-3 text-xs text-[#9ba6af]">
            {benchmark.task_count} planned tasks
          </span>
        </summary>
        <p className="mt-3 text-xs text-[#9ba6af]" aria-live="polite">
          {rows.length} of {benchmark.task_count} tasks · Scope labels are provisional.
          Caps: $1 light / $2 medium / $4 heavy, per system.
        </p>
        <div className="mt-5 flex flex-wrap gap-4">
          <label className="grid gap-2 text-xs text-[#9ba6af]">
            Repository
            <select
              className={selectClass}
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
            >
              <option value="all">All repositories</option>
              {[...new Set(benchmark.tasks.map((t) => t.repo))]
                .sort()
                .map((r) => (
                  <option key={r}>{r}</option>
                ))}
            </select>
          </label>
          <label className="grid gap-2 text-xs text-[#9ba6af]">
            Category
            <select
              className={selectClass}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All categories</option>
              {Object.entries(categories).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-xs text-[#9ba6af]">
            Outcome in either system
            <select
              className={selectClass}
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
            >
              <option value="all">All outcomes</option>
              {Object.entries(label).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[670px] text-left text-xs">
            <caption className="sr-only">
              Task results including all failures and unrun tasks
            </caption>
            <thead className="border-b border-white/15 text-[#9ba6af]">
              <tr>
                <th className="py-3 font-normal">Task / category</th>
                <th className="px-3 font-normal">mini-SWE-agent</th>
                <th className="px-3 font-normal">Engine core</th>
                <th className="px-3 font-normal">Evidence</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id} className="border-b border-white/5">
                  <th scope="row" className="max-w-sm py-4 pr-4 font-normal">
                    <span className="font-mono text-[#d5dde3]">{t.id}</span>
                    <span className="ml-3 text-[#9ba6af]">
                      {categories[t.category]}
                    </span>
                    <p className="mt-1.5 leading-5 text-[#9ba6af]">{t.title}</p>
                    <p className="mt-1 text-xs text-[#7eb5d0]"><span className="capitalize">{t.difficulty}</span> · {t.attempt_limit_usd === null ? "—" : `$${t.attempt_limit_usd.toFixed(2)}`} cap per system</p>
                    <p className="mt-1 text-[10px] text-[#9ba6af]">
                      {t.category === "bug"
                        ? "Fabricated regression · upstream tests retained"
                        : t.category === "test-generation"
                          ? "Supplied feature · reference tests withheld"
                          : t.category === "cross-file"
                            ? "Fabricated feature request"
                            : "Pinned source navigation"}
                    </p>
                  </th>
                  {["mini-swe-agent", "engine-core"].map((s) => (
                    <td key={s} className="px-3">
                      <Status arm={t.systems[s]} />
                      {t.systems[s].termination &&
                        t.systems[s].status !== "pass" && (
                          <p className="mt-1 text-[10px] text-[#9ba6af]">
                            {t.systems[s].termination.replaceAll("_", " ")}
                          </p>
                        )}
                      <p className="mt-1 text-[11px] text-[#9ba6af]">
                        {money(t.systems[s].cost_usd)} ·{" "}
                        {time(t.systems[s].elapsed_s)}
                      </p>
                    </td>
                  ))}
                  <td className="px-3">
                    {Object.entries(t.systems)
                      .filter(([, a]) => a.attempt_id)
                      .map(([s, a]) => (
                        <a
                          key={s}
                          className="mb-2 block text-[#7eb5d0] underline underline-offset-4"
                          href={`/engine/results/runs/${benchmark.run_id}/${a.attempt_id}`}
                        >
                          {names[s]}
                        </a>
                      ))}
                    {!Object.values(t.systems).some((a) => a.attempt_id) && (
                      <span className="text-[#7a848c]">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && (
            <p className="py-8 text-sm text-[#9ba6af]">
              No tasks match these filters.
            </p>
          )}
        </div>
      </details>

      <RunCatalog />
      <details id="grading" className="border-b border-white/10 py-3">
        <summary className="min-h-11 cursor-pointer py-3 text-xs text-[#7eb5d0]">
          Grading rules & comparison method
        </summary>
        <GradingGuide />
      </details>
      <BenchmarkSetupNotes />

      <section
        className="grid gap-8 border-b border-white/10 py-10 md:grid-cols-2"
        aria-label="Protocol and downloads"
      >
        <div>
          <h2 className="font-mono text-sm font-semibold text-[#d5dde3]">
            Read the protocol. Rebuild the report.
          </h2>
          <p className="mt-3 text-xs leading-6 text-[#9ba6af]">
            Whole-system comparison · zero ablations · deterministic grading.
          </p>
          <a
            className="mt-4 inline-block text-xs text-[#7eb5d0] underline underline-offset-4"
            href="https://github.com/iresharma/codeloom.benchmark"
          >
            Harness and reproduction instructions ↗
          </a>
        </div>
        <div>
          <h2 className="font-mono text-sm font-semibold text-[#d5dde3]">
            Download the evidence
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {[
              ["report.md", "Report"],
              ["summary.csv", "Results CSV"],
              ["summary.json", "Results JSON"],
              ["attempts.jsonl", "All attempts"],
              ["runs.json", "Run index"],
              ["evidence.zip", "Evidence ZIP"],
            ].map(([file, title]) => (
              <a
                key={file}
                download
                href={`${download}/${file}`}
                className="border border-white/15 px-4 py-3 text-xs text-[#d5dde3] hover:border-[#ff5c33] focus-visible:outline-2 focus-visible:outline-[#ff5c33]"
              >
                {title} ↓
              </a>
            ))}
          </div>
          <p className="mt-4 text-xs leading-6 text-[#9ba6af]">
            The evidence bundle includes synthetic adapter traces and setup
            checks, clearly labeled separately from measured attempts.
          </p>
          <details className="mt-5 text-xs text-[#9ba6af]">
            <summary className="cursor-pointer py-2 text-[#d5dde3]">
              Study limitations
            </summary>
            <ul className="mt-2 list-disc space-y-2 pl-5 leading-6">
              {benchmark.limitations.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </details>
        </div>
      </section>
    </>
  );
}
