"use client";

import { useState } from "react";
import setup from "./data/setup.json";
import data from "./data/benchmark.json";
import runs from "./data/run-index.json";
import { RingChart, panelClass, titleClass } from "./charts";

const categoryNames: Record<string, string> = {
  bug: "Bug fix",
  "cross-file": "Cross-file",
  navigation: "Navigation",
  "test-generation": "Tests",
};
const control =
  "min-h-11 border border-white/15 px-4 py-2 text-xs text-[#d5dde3] hover:border-[#ff5c33] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5c33]";

export function BenchmarkInsights({
  select,
}: {
  select: (repo: string, category: string) => void;
}) {
  const repos = [...new Set(data.tasks.map((t) => t.repo))];
  const certified = setup.tasks.filter((t) => t.status === "certified").length;
  const measuredPoints = data.tasks.flatMap((t) =>
    Object.entries(t.systems).flatMap(([system, a]) =>
      a.cost_usd !== null && a.elapsed_s !== null
        ? [
            {
              task: t.id,
              system,
              cost: Number(a.cost_usd),
              elapsed: Number(a.elapsed_s) / 60,
              attempt: a.attempt_id,
            },
          ]
        : [],
    ),
  );
  const maxTime = Math.max(...measuredPoints.map((p) => p.elapsed), 1),
    maxCost = Math.max(...measuredPoints.map((p) => p.cost), 0.01);
  return (
    <section
      className="border-b border-white/10 py-8"
      aria-label="Suite and budget infographics"
    >
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className={panelClass}>
          <div className="flex flex-wrap justify-between gap-3">
            <h2 className={titleClass}>Task coverage</h2>
            <span className="text-xs text-[#8ccf9f]">
              {certified}/{data.task_count} fixtures certified
            </span>
          </div>
          <p className="mt-2 text-xs text-[#9ba6af]">
            Select a cell to filter the task list.
          </p>
          <div className="mt-5 grid grid-cols-[72px_repeat(4,minmax(0,1fr))] gap-2 text-center text-[11px] sm:grid-cols-[90px_repeat(4,minmax(0,1fr))]">
            <span />
            {Object.values(categoryNames).map((name) => (
              <span
                key={name}
                className="self-end break-words pb-2 text-[#9ba6af]"
              >
                {name}
              </span>
            ))}
            {repos.map((repo) => (
              <div className="contents" key={repo}>
                <span className="self-center break-words text-left font-mono text-[#c3cbd1]">
                  {repo}
                </span>
                {Object.entries(categoryNames).map(([category, name]) => {
                  const task = data.tasks.find(
                    (t) => t.repo === repo && t.category === category,
                  );
                  const cert = setup.tasks.find((t) => t.id === task?.id);
                  return (
                    <button
                      key={category}
                      type="button"
                      aria-label={`${repo}, ${name}: ${task ? 1 : 0} task; fixture ${cert?.status ?? "not checked"}`}
                      onClick={() => {
                        select(repo, category);
                        document
                          .getElementById("task-explorer")
                          ?.scrollIntoView({ block: "start" });
                      }}
                      className={`min-h-12 border text-sm focus-visible:outline-2 focus-visible:outline-[#ff5c33] ${cert?.status === "certified" ? "border-[#8ccf9f]/25 bg-[#8ccf9f]/10 text-[#8ccf9f] hover:bg-[#8ccf9f]/20" : "border-white/10 bg-white/5 text-[#9ba6af]"}`}
                    >
                      {task ? "1" : "—"}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-[#9ba6af]">
            Green = reference/evaluator certification. It is not an agent
            success score.
          </p>
        </div>
        <div className={panelClass}>
          <h2 className={titleClass}>Where the $50 goes</h2>
          <div className="mt-5">
            <RingChart
              items={setup.budget}
              value="$50"
              label="budget ceiling"
            />
          </div>
          <p className="mt-4 text-xs text-[#9ba6af]">
            Planned allocation · no paid run authorized.
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className={panelClass}>
          <h2 className={titleClass}>Recorded setup checks</h2>
          <div className="mt-5 space-y-3">
            {[
              [
                "Task fixtures",
                `${certified} certified`,
                certified === data.task_count,
              ],
              [
                "Native reasoning continuity",
                setup.compatibility_status,
                setup.compatibility_status === "passed",
              ],
              [
                "Provider price bound",
                setup.pricing_status,
                setup.pricing_status === "passed",
              ],
            ].map(([name, value, passed]) => (
              <div
                key={String(name)}
                className="flex justify-between gap-3 border-b border-white/5 pb-3 text-xs"
              >
                <span className="text-[#9ba6af]">{name}</span>
                <span className={passed ? "text-[#8ccf9f]" : "text-[#e2bd6b]"}>
                  {value}
                </span>
              </div>
            ))}
          </div>
          <details className="mt-2 text-xs text-[#9ba6af]">
            <summary className="min-h-11 cursor-pointer py-3 text-[#7eb5d0]">
              Native continuity checks
            </summary>
            <ul className="space-y-2">
              {Object.entries(setup.compatibility_checks).map(
                ([name, passed]) => (
                  <li
                    key={name}
                    className="flex flex-wrap justify-between gap-2"
                  >
                    <span className="break-words">
                      {name.replaceAll("_", " ")}
                    </span>
                    <span
                      className={passed ? "text-[#8ccf9f]" : "text-[#e2bd6b]"}
                    >
                      {passed ? "Passed" : "Failed"}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </details>
          <p className="mt-2 text-xs leading-5 text-[#9ba6af]">
            Historical setup evidence. Recheck after thinking/effort support
            changes.
          </p>
        </div>
        <div className={panelClass}>
          <h2 className={titleClass}>Task cost vs. elapsed time</h2>
          <div className="relative mt-5">
            <svg
              viewBox="0 0 400 160"
              className="w-full"
              role="img"
              aria-label={
                measuredPoints.length
                  ? `${measuredPoints.length} measured task/system points, minutes on x-axis and dollars on y-axis`
                  : "Cost versus time unavailable: no measured task attempts"
              }
            >
              {[30, 65, 100, 135].map((y) => (
                <path key={y} d={`M35 ${y} H380`} stroke="#ffffff10" />
              ))}
              <path d="M35 20 V135 H380" fill="none" stroke="#ffffff30" />
              <text x="35" y="154" fill="#9ba6af" fontSize="10">
                0 min
              </text>
              <text
                x="370"
                y="154"
                fill="#9ba6af"
                fontSize="10"
                textAnchor="end"
              >
                {measuredPoints.length
                  ? `${maxTime.toFixed(1)} min`
                  : "elapsed →"}
              </text>
              <text x="3" y="25" fill="#9ba6af" fontSize="10">
                {measuredPoints.length ? `$${maxCost.toFixed(2)}` : "$"}
              </text>
              {measuredPoints.map((p) => (
                <a
                  key={`${p.task}-${p.system}`}
                  href={`/engine/results/runs/${data.run_id}/${p.attempt}`}
                >
                  <circle
                    cx={35 + (p.elapsed / maxTime) * 335}
                    cy={135 - (p.cost / maxCost) * 110}
                    r="5"
                    fill={p.system === "engine-core" ? "#ff5c33" : "#7eb5d0"}
                  >
                    <title>
                      {p.task} · {p.system}: ${p.cost.toFixed(3)},{" "}
                      {p.elapsed.toFixed(1)} minutes
                    </title>
                  </circle>
                </a>
              ))}
              {!measuredPoints.length && (
                <text
                  x="210"
                  y="78"
                  textAnchor="middle"
                  fill="#9ba6af"
                  fontSize="12"
                >
                  Awaiting scored runs
                </text>
              )}
            </svg>
          </div>
          <p className="mt-3 text-xs leading-5 text-[#9ba6af]">
            Engine orange · mini blue. Each point includes eligible recovery
            cost/time; unknown values are omitted.
          </p>
        </div>
      </div>
    </section>
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
