"use client";

import { useState } from "react";
import setup from "./data/setup.json";
import data from "./data/benchmark.json";
import runs from "./data/run-index.json";
import { panelClass, titleClass } from "./charts";

const control =
  "min-h-11 border border-white/15 px-4 py-2 text-xs text-[#d5dde3] hover:border-[#ff5c33] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5c33]";
const systems: Record<string, string> = {
  "mini-swe-agent": "mini-SWE-agent",
  "engine-core": "Engine core",
};
const outcomes = [
  { key: "passed", label: "Passed", color: "#8ccf9f" },
  { key: "failed", label: "Failed", color: "#f28c79" },
  { key: "unresolved", label: "Unresolved", color: "#e2bd6b" },
  { key: "unrun", label: "Not run", color: "#ffffff18" },
];

export function BenchmarkInsights() {
  const measured = data.status !== "not_run";
  const knownCost =
    !measured ||
    data.systems.every(
      (s) => s.cost_usd !== null || s.evaluated + s.unresolved === 0,
    );
  const spent = data.systems.reduce((n, s) => n + (s.cost_usd ?? 0), 0);
  const complete = data.systems.reduce(
    (n, s) => n + s.evaluated + s.unresolved,
    0,
  );
  return (
    <section
      className="grid gap-6 border-b border-white/10 py-8 md:grid-cols-2"
      aria-label="Benchmark progress and actual cost"
    >
      <div>
        <h2 className={titleClass}>Attempt outcomes</h2>
        <p className="mt-2 text-xs text-[#9ba6af]">
          {complete} of {data.task_count * 2} scheduled outcomes recorded
        </p>
        <div className="mt-6 space-y-5">
          {data.systems.map((s) => {
            const values: Record<string, number> = {
              passed: s.passed,
              failed: s.evaluated - s.passed,
              unresolved: s.unresolved,
              unrun: s.unrun,
            };
            return (
              <div key={s.id}>
                <div className="mb-2 flex justify-between text-xs text-[#c3cbd1]">
                  <span>{systems[s.id]}</span>
                  <span>
                    {s.evaluated + s.unresolved}/{s.scheduled}
                  </span>
                </div>
                <div
                  className="flex h-3 overflow-hidden bg-white/5"
                  role="img"
                  aria-label={`${systems[s.id]}: ${outcomes.map((o) => `${values[o.key]} ${o.label.toLowerCase()}`).join(", ")}`}
                >
                  {outcomes.map((o) => (
                    <span
                      key={o.key}
                      style={{
                        width: `${(values[o.key] / s.scheduled) * 100}%`,
                        background: o.color,
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-[#9ba6af]">
          {outcomes.map((o) => (
            <span key={o.key} className="flex items-center gap-2">
              <span
                className="h-2 w-2"
                style={{ background: o.color }}
                aria-hidden="true"
              />
              {o.label}
            </span>
          ))}
        </div>
      </div>
      <div>
        <h2 className={titleClass}>Measured inference spend</h2>
        <p className="mt-4 font-mono text-3xl text-[#d5dde3]">
          {knownCost ? `$${spent.toFixed(2)}` : "Unavailable"}
        </p>
        <p className="mt-2 text-xs leading-6 text-[#9ba6af]">
          {measured
            ? "Includes failed attempts and eligible recoveries."
            : "No measured attempts yet. Fills in as results are published."}
        </p>
        <details className="mt-3 text-xs text-[#9ba6af]">
          <summary className="min-h-11 cursor-pointer py-3 text-[#7eb5d0]">
            Budget plan · ${data.budget_usd} ceiling
          </summary>
          <dl className="space-y-2">
            {setup.budget.map((b) => (
              <div key={b.label} className="flex justify-between gap-3">
                <dt>{b.label}</dt>
                <dd>${b.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 leading-5">
            Allocation is fixed. The spend above excludes calibration, fees and
            buffer; it is not the campaign bill.
          </p>
        </details>
      </div>
    </section>
  );
}

export function BenchmarkSetupNotes() {
  const base = `/benchmarks/${data.run_id}/setup`;
  return (
    <details className="border-b border-white/10 py-3 text-xs text-[#9ba6af]">
      <summary className="min-h-11 cursor-pointer py-3 text-[#7eb5d0]">
        Pre-run validation · recorded setup evidence
      </summary>
      <p className="mt-2 leading-6">
        Checks of the test fixtures, model integration and price limits before
        measurement. These are historical diagnostics, not agent scores.
      </p>
      <dl className="mt-4 space-y-4">
        {[
          {
            name: "Task fixtures",
            result: setup.certification_status === "stale" ? "stale · recertification required" : `${setup.certified_tasks}/${data.task_count} certified`,
            detail:
              "Certification must match the current Engine and runtime image.",
            file: "certification.json",
          },
          {
            name: "Model integration",
            result: setup.compatibility_status,
            detail:
              "Whether native tool continuations preserve required reasoning state.",
            file: "compatibility.json",
          },
          {
            name: "Provider pricing",
            result: setup.pricing_status,
            detail:
              "Whether observed prices fit the configured admission limits.",
            file: "pricing.json",
          },
        ].map((c) => (
          <div key={c.name}>
            <dt className="text-[#d5dde3]">
              {c.name} · {c.result}
            </dt>
            <dd className="mt-1 leading-6">
              {c.detail}{" "}
              <a
                className="text-[#7eb5d0] underline"
                href={`${base}/${c.file}`}
              >
                Evidence ↗
              </a>
            </dd>
          </div>
        ))}
      </dl>
      <a className="mt-4 inline-block min-h-11 py-3 text-[#7eb5d0] underline" href={`${base}/cost-analysis.md`}>Cost projection · assumptions and rates ↗</a>
      <p className="mt-4 leading-6">
        Native High effort checks pass. Fixture recertification and live calibration remain pending. Paid runs are paused.
      </p>
    </details>
  );
}

export function RunCatalog() {
  const [kind, setKind] = useState("all");
  const rows = runs.filter(
    (r) => kind === "all" || (kind === "synthetic") === r.synthetic,
  );
  return (
    <section className="border-b border-white/10 py-10" id="runs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className={titleClass}>Open a recorded run</h2>
        <span className="font-mono text-xs text-[#9ba6af]">
          {runs.filter((r) => !r.synthetic).length} task attempts ·{" "}
          {runs.filter((r) => r.synthetic).length} synthetic checks
        </span>
      </div>
      <div className="my-5 flex flex-wrap gap-2">
        {[
          ["all", "All recordings"],
          ["measured", "Task attempts"],
          ["synthetic", "Synthetic checks"],
        ].map(([id, label]) => (
          <button
            className={`${control} ${kind === id ? "border-[#ff5c33] bg-[#ff5c33]/10" : ""}`}
            key={id}
            type="button"
            aria-pressed={kind === id}
            onClick={() => setKind(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {rows.map((r) => (
          <a
            key={`${r.run_id}-${r.id}`}
            href={`/engine/results/runs/${r.run_id}/${r.id}`}
            className="group flex flex-wrap items-center justify-between gap-4 border border-white/10 bg-white/[0.02] p-5 hover:border-[#7eb5d0]/50 focus-visible:outline-2 focus-visible:outline-[#ff5c33]"
          >
            <div>
              <p className="font-mono text-sm text-[#d5dde3]">
                {r.task_id} <span className="text-[#9ba6af]">· {r.system}</span>
              </p>
              <p className="mt-2 text-xs text-[#e2bd6b]">
                {r.synthetic
                  ? "Scripted integration check · not a model score"
                  : `${r.stage} · ${r.passed ? "passed" : r.termination}`}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#9ba6af]">
              <span>{r.request_count} requests</span>
              <span>{r.tool_calls} tools</span>
              <span>{r.agent_count - 1} children</span>
              <span className="text-[#7eb5d0]">Inspect run →</span>
            </div>
          </a>
        ))}
      </div>
      {!rows.length && (
        <p className="border border-white/10 px-5 py-8 text-sm text-[#9ba6af]">
          No task attempts have been published. Paid runs remain paused.
        </p>
      )}
    </section>
  );
}
