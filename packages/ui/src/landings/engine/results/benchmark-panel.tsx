"use client";

import { useEffect, useMemo, useState } from "react";
import data from "./data/benchmark.json";
import {
  BenchmarkInsights,
  BenchmarkSetupNotes,
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
  execution_state?: string;
  functional_pass?: boolean | null;
  tool_evidence?: { pass: boolean; checks: Record<string, boolean> } | null;
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
  schema_version?: number;
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
  preregistration_commit: string | null;
  blocked_reason?: string | null;
  concurrency?: { max_parallel_task_pairs: number; max_parallel_attempts: number; evaluation_workers: number };
  scheduler?: {
    observed_parallel_attempts?: number;
    budget?: { actual_spent_usd: number; outstanding_estimate_usd: number };
    jobs: { id: string; task_id: string; system: string; state: string }[];
  };
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
  browser: "Browser rendering",
  research: "Research and implementation",
  terminal: "Terminal workflow",
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
    <div>
    <span
      className="font-mono text-xs"
      style={{ color: colors[arm.status] }}
      title={arm.termination ?? undefined}
    >
      {arm.status === "unrun" && arm.execution_state ? arm.execution_state.replaceAll("_", " ") : label[arm.status]}
    </span>
    {arm.tool_evidence && (
      <details className="mt-1 text-xs text-[#9ba6af]">
        <summary className="min-h-11 cursor-pointer py-3">Verification evidence</summary>
        <p>Functionality: {arm.functional_pass ? "pass" : "fail"}</p>
        <p>Required tools: {arm.tool_evidence.pass ? "pass" : "fail"}</p>
        <ul className="mt-2 space-y-1">{Object.entries(arm.tool_evidence.checks).map(([check, passed]) => (
          <li key={check}>{check.replaceAll("_", " ")}: {passed ? "pass" : "missing"}</li>
        ))}</ul>
      </details>
    )}
    </div>
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
    if (["grading", "task-explorer"].includes(target)) {
      const element = document.getElementById(target);
      if (element instanceof HTMLDetailsElement) element.open = true;
    }
  }, []);
  const measured = benchmark.status !== "not_run";
  const totals = benchmark.systems.map(({ id }) => {
    const arms = rows.map((task) => task.systems[id]);
    return {
      id,
      passed: arms.filter((arm) => arm.status === "pass").length,
      recorded: arms.filter((arm) => arm.status !== "unrun").length,
      cost: arms.some((arm) => arm.status !== "unrun" && arm.cost_usd === null)
        ? null
        : arms.reduce((sum, arm) => sum + (arm.cost_usd ?? 0), 0),
      elapsed: arms.some((arm) => arm.status !== "unrun" && arm.elapsed_s === null)
        ? null
        : arms.reduce((sum, arm) => sum + (arm.elapsed_s ?? 0), 0),
    };
  });
  const totalCost = totals.some((total) => total.cost === null)
    ? null
    : totals.reduce((sum, total) => sum + (total.cost ?? 0), 0);
  const selectClass =
    "min-h-11 border border-white/15 bg-[#13191f] px-3 font-mono text-xs text-[#d5dde3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5c33]";
  return (
    <>
      <a href="https://benchmark-monitor-production.up.railway.app" className="mt-6 inline-flex min-h-11 items-center border border-white/15 px-4 text-xs text-[#7eb5d0] hover:border-[#ff5c33] focus-visible:outline-2 focus-visible:outline-[#ff5c33]">Live Railway monitor · unscored smoke test and campaign status ↗</a>
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
            ["Campaign spending target", `$${benchmark.budget_usd}`],
          ].map(([name, value]) => (
            <div key={name} className="bg-[#0c1014] p-5">
              <dt className="text-xs text-[#9ba6af]">{name}</dt>
              <dd className="mt-2 font-mono text-2xl text-[#d5dde3]">
                {value}
              </dd>
            </div>
          ))}
        </dl>
        {benchmark.schema_version === 2 && (
          <div className="mt-6 border border-white/10 p-5 text-sm text-[#c3cbd1]">
            <p>
              Up to {benchmark.concurrency?.max_parallel_task_pairs ?? 3} task pairs · {benchmark.concurrency?.max_parallel_attempts ?? 6} agent attempts · {benchmark.concurrency?.evaluation_workers ?? 2} evaluators
            </p>
            <p className="mt-2 text-xs text-[#9ba6af]">
              Actual inference spending: {money(benchmark.scheduler?.budget?.actual_spent_usd ?? null)} · Outstanding estimates: {money(benchmark.scheduler?.budget?.outstanding_estimate_usd ?? null)}.
              Final concurrent calls may exceed the spending target. Unrun tasks remain visible.
            </p>
            {benchmark.scheduler && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <caption className="pb-2 text-left text-[#9ba6af]">Campaign execution states</caption>
                  <thead><tr><th scope="col" className="py-2">Task</th><th scope="col">System</th><th scope="col">State</th></tr></thead>
                  <tbody>{benchmark.scheduler.jobs.map(job => (
                    <tr key={job.id}><td className="py-2 pr-4">{job.task_id}</td><td className="pr-4">{names[job.system] ?? job.system}</td><td>{job.state.replaceAll("_", " ")}</td></tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {!measured && (
          <div className="mt-6 border-l-2 border-[#e2bd6b] bg-[#e2bd6b]/5 px-5 py-4 text-sm leading-6 text-[#c3cbd1]">
            <strong className="font-medium">
              Official measured results have not been published yet.
            </strong>
            <p className="mt-1 text-xs">
              Completed benchmark results will be published here as static data after the campaign finishes.
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

      <details className="scroll-mt-24 border-b border-white/10 py-3" id="task-explorer" open>
        <summary className="min-h-11 cursor-pointer py-3 font-mono text-sm text-[#d5dde3]">
          Task list{" "}
          <span className="ml-3 text-xs text-[#9ba6af]">
            {benchmark.task_count} tasks
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
        <div
          className="mt-6 h-[34rem] max-h-[75vh] scroll-pt-12 scroll-pb-24 overflow-auto border border-white/10 focus-visible:outline-2 focus-visible:outline-[#ff5c33]"
          role="region"
          aria-label="Task results, scroll to view all tasks"
          tabIndex={0}
        >
          <table className="h-full w-full min-w-[740px] border-separate border-spacing-0 text-left text-xs [&_tbody_td]:border-b [&_tbody_th]:border-b [&_tbody_td]:border-white/5 [&_tbody_th]:border-white/5">
            <caption className="sr-only">
              Task results including all failures and unrun tasks
            </caption>
            <thead className="sticky top-0 z-10 bg-[#0c1014] text-[#9ba6af] [&_th]:border-b [&_th]:border-white/15">
              <tr>
                <th className="px-4 py-3 font-normal">Task / category</th>
                <th className="px-3 font-normal">mini-SWE-agent</th>
                <th className="px-3 font-normal">Engine core</th>
                <th className="px-3 font-normal">Evidence</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id} className="border-b border-white/5">
                  <th scope="row" className="max-w-sm px-4 py-4 font-normal">
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
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-sm text-[#9ba6af]">
                    No tasks match these filters.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="sticky bottom-0 z-10 bg-[#13191f] text-[#d5dde3] [&_th]:border-t [&_td]:border-t [&_th]:border-white/15 [&_td]:border-white/15">
              <tr aria-live="polite">
                <th scope="row" className="px-4 py-4 font-normal">
                  <span className="font-mono">Totals · {rows.length} tasks</span>
                  <span className="mt-1 block text-[#9ba6af]">
                    {rows.length === benchmark.task_count ? "All tasks" : "Filtered tasks"}
                  </span>
                </th>
                {totals.map((total) => (
                  <td key={total.id} className="px-3 py-4">
                    <span className="block font-mono">{money(total.cost)}</span>
                    <span className="mt-1 block text-[#9ba6af]">
                      {total.passed} passed / {total.recorded} recorded
                    </span>
                    <span className="mt-1 block text-[#9ba6af]">
                      {time(total.elapsed)} total
                    </span>
                  </td>
                ))}
                <td className="px-3 py-4">
                  <span className="block text-[#9ba6af]">Total cost</span>
                  <span className="mt-1 block font-mono text-sm">{money(totalCost)}</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </details>

      <details id="grading" className="border-b border-white/10 py-3">
        <summary className="min-h-11 cursor-pointer py-3 text-xs text-[#7eb5d0]">
          Grading rules & comparison method
        </summary>
          <GradingGuide suite={benchmark.schema_version === 2 ? "v2" : "v1"} />
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
