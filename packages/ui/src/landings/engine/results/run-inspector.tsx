"use client";

import { useMemo, useState } from "react";
import { PRODUCTS } from "@codeloom/config";
import { SiteNav } from "../../../chrome/site-nav";
import { EngineSubNav } from "../../../chrome/engine-subnav";
import { SiteFooter } from "../../../chrome/footer";
import { ProductShell } from "../../../components/product-shell";
import { BarChart, Stat, panelClass, titleClass } from "./charts";

type Event = {
  sequence: number;
  kind: string;
  agent_id: string;
  title: string;
  detail: string;
  reasoning?: string;
  output?: string | null;
  ok?: boolean | null;
  duration_ms?: number | null;
};
type Agent = {
  id: string;
  profile: string;
  parent_id: string | null;
  task: string;
  status: string;
  tool_calls: number;
  tools: { name: string; count: number }[];
};
type Request = {
  id: string;
  model: string | null;
  reasoning_effort: string | null;
  status: string;
  elapsed_s: number | null;
  first_byte_s: number | null;
  admission_queue_s: number | null;
  usage: { total_tokens?: number; cost?: number } | null;
  providers: string[];
  message_count: number;
  response: {
    text: string;
    reasoning: string;
    tool_calls: { id: string; name: string; arguments: string }[];
  };
};
export type RunView = {
  id: string;
  task_id: string;
  system: string;
  stage: string;
  synthetic: boolean;
  termination: string;
  passed: boolean;
  cost_usd: number | null;
  elapsed_s: number | null;
  retry_of: string | null;
  agents: Agent[];
  timeline: Event[];
  requests: Request[];
  checks: {
    kind: string;
    command: string;
    passed: boolean;
    output: string;
    repeat: number;
  }[];
  grading: Record<string, unknown>;
  patch: string;
  trace_available: boolean;
  tool_output_is_preview: boolean;
};
const buttonClass =
  "min-h-11 border border-white/15 px-4 py-2 text-xs text-[#c3cbd1] hover:border-[#ff5c33] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5c33]";
const selectClass =
  "min-h-11 w-full border border-white/15 bg-[#13191f] px-3 text-xs text-[#d5dde3] focus-visible:outline-2 focus-visible:outline-[#ff5c33]";
const seconds = (n: number | null) =>
  n === null
    ? "Unavailable"
    : n < 1
      ? `${Math.round(n * 1000)}ms`
      : `${n.toFixed(2)}s`;

function Payload({ label, text }: { label: string; text: string }) {
  return (
    <details className="mt-2">
      <summary className="min-h-11 cursor-pointer py-3 text-xs text-[#7eb5d0]">
        {label}
      </summary>
      <pre className="max-h-96 overflow-auto border border-white/10 bg-[#0a0d10] p-4 font-mono text-xs leading-6 whitespace-pre-wrap break-words text-[#c3cbd1]">
        {text || "No content recorded."}
      </pre>
    </details>
  );
}

export function RunInspector({
  run,
  artifactBase,
}: {
  run: RunView;
  artifactBase: string;
}) {
  const [tab, setTab] = useState("Timeline");
  const [agent, setAgent] = useState("all");
  const [kind, setKind] = useState("all");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(100);
  const events = useMemo(
    () =>
      run.timeline.filter(
        (e) =>
          (agent === "all" || e.agent_id === agent) &&
          (kind === "all" || e.kind === kind) &&
          `${e.title} ${e.detail} ${e.output ?? ""}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [run, agent, kind, search],
  );
  const tools = useMemo(() => {
    const counts: Record<string, number> = {};
    run.agents
      .flatMap((a) => a.tools)
      .forEach((t) => (counts[t.name] = (counts[t.name] ?? 0) + t.count));
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label, value }));
  }, [run]);
  const product = PRODUCTS.engine;
  return (
    <ProductShell product={product} className="bg-[#0c1014]">
      <SiteNav active="engine" />
      <EngineSubNav active="results" />
      <main className="mx-auto max-w-6xl px-5 pb-12 md:px-8">
        <header className="border-b border-white/10 py-10">
          <a
            className="inline-flex min-h-11 items-center text-xs text-[#7eb5d0]"
            href="/engine/results"
          >
            ← All results
          </a>
          <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs">
            <span className="border border-white/15 px-3 py-2 text-[#e2bd6b]">
              {run.synthetic
                ? "Synthetic integration check · not scored"
                : `${run.stage} attempt`}
            </span>
            <span className="border border-white/15 px-3 py-2 text-[#9ba6af]">
              {run.system}
            </span>
          </div>
          <h1 className="mt-5 break-words font-mono text-2xl text-[#d5dde3]">
            {run.task_id}{" "}
            <span className="text-[#ff5c33]">/ run inspector</span>
          </h1>
          <p className="mt-3 break-all font-mono text-xs text-[#9ba6af]">
            {run.id} · {run.termination.replaceAll("_", " ")}
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
        <div className="my-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Recorded requests" value={run.requests.length} />
          <Stat
            label="Recorded tool calls"
            value={tools.reduce((n, t) => n + t.value, 0)}
          />
          <Stat
            label="Spawned agents"
            value={run.agents.filter((a) => a.id !== "root").length}
          />
          <Stat
            label="Actual inference charge"
            value={
              run.cost_usd === null
                ? "Unavailable"
                : `$${run.cost_usd.toFixed(4)}`
            }
          />
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_1.3fr]">
          <div className={panelClass}>
            <h2 className={titleClass}>Tools used</h2>
            <div className="mt-5">
              {tools.length ? (
                <BarChart
                  items={tools.slice(0, 8)}
                  caption="Recorded calls; a call can fail. Counts come from native traces."
                />
              ) : (
                <p className="text-xs text-[#9ba6af]">
                  No tool calls recorded.
                </p>
              )}
            </div>
          </div>
          <div className={panelClass}>
            <h2 className={titleClass}>Run outcome</h2>
            <dl className="mt-5 grid grid-cols-2 gap-4 text-xs">
              <div>
                <dt className="text-[#9ba6af]">Grading</dt>
                <dd className="mt-2 text-[#d5dde3]">
                  {run.synthetic
                    ? "Expected no-op failure"
                    : [
                          "provider_error",
                          "transport_error",
                          "host_error",
                          "infra_unresolved",
                        ].includes(run.termination)
                      ? "Unresolved infrastructure"
                      : run.passed
                        ? "Passed required checks"
                        : "Did not pass"}
                </dd>
              </div>
              <div>
                <dt className="text-[#9ba6af]">Attempt elapsed</dt>
                <dd className="mt-2 text-[#d5dde3]">
                  {seconds(run.elapsed_s)}
                </dd>
              </div>
              <div>
                <dt className="text-[#9ba6af]">Trace coverage</dt>
                <dd className="mt-2 text-[#d5dde3]">
                  {run.trace_available
                    ? "Native trace available"
                    : "Trace unavailable"}
                </dd>
              </div>
              <div>
                <dt className="text-[#9ba6af]">Upstream checks</dt>
                <dd className="mt-2 text-[#d5dde3]">
                  {
                    run.checks.filter((c) => c.kind === "trusted" && c.passed)
                      .length
                  }{" "}
                  passed /{" "}
                  {run.checks.filter((c) => c.kind === "trusted").length}{" "}
                  recorded
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <nav
          aria-label="Run evidence views"
          className="my-6 flex flex-wrap gap-2"
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
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="grid gap-2 text-xs text-[#9ba6af]">
                  Agent
                  <select
                    className={selectClass}
                    value={agent}
                    onChange={(e) => {
                      setAgent(e.target.value);
                      setLimit(100);
                    }}
                  >
                    <option value="all">All agents</option>
                    {run.agents.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.profile} · {a.id}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-xs text-[#9ba6af]">
                  Event kind
                  <select
                    className={selectClass}
                    value={kind}
                    onChange={(e) => {
                      setKind(e.target.value);
                      setLimit(100);
                    }}
                  >
                    <option value="all">All events</option>
                    {["message", "tool", "agent", "error", "event"].map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-xs text-[#9ba6af]">
                  Search recorded content
                  <input
                    className={selectClass}
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setLimit(100);
                    }}
                    placeholder="Tool, command or message"
                  />
                </label>
              </div>
              <p
                className="my-4 text-xs leading-6 text-[#9ba6af]"
                aria-live="polite"
              >
                {events.length} matching entries · recorded start order,
                streaming fragments combined.
                {run.tool_output_is_preview
                  ? " Tool results are Engine previews."
                  : ""}
              </p>
              <div className="space-y-3">
                {events.slice(0, limit).map((e) => (
                  <article className={panelClass} key={e.sequence}>
                    <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                      <span className="text-[#9ba6af]">
                        #{String(e.sequence).padStart(3, "0")}
                      </span>
                      <span className="text-[#7eb5d0]">{e.kind}</span>
                      <h3 className="break-all text-[#d5dde3]">{e.title}</h3>
                      <span className="ml-auto text-[#9ba6af]">
                        {run.agents.find((a) => a.id === e.agent_id)?.profile} ·{" "}
                        {e.agent_id.slice(0, 12)}
                      </span>
                      {e.kind === "tool" && (
                        <span
                          className={
                            e.ok === false ? "text-[#f28c79]" : "text-[#8ccf9f]"
                          }
                        >
                          {e.ok === null
                            ? "Result unavailable"
                            : e.ok
                              ? "OK"
                              : "Failed"}
                          {e.duration_ms != null ? ` · ${e.duration_ms}ms` : ""}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 line-clamp-2 break-words font-mono text-xs leading-6 text-[#9ba6af]">
                      {e.detail || "No text content"}
                    </p>
                    <Payload
                      label={
                        e.kind === "tool"
                          ? "Arguments"
                          : "Full recorded content"
                      }
                      text={e.detail}
                    />
                    {e.output != null && (
                      <Payload
                        label={
                          run.tool_output_is_preview
                            ? "Tool result preview"
                            : "Tool result"
                        }
                        text={e.output}
                      />
                    )}
                    {e.reasoning && (
                      <Payload label="Returned reasoning" text={e.reasoning} />
                    )}
                  </article>
                ))}
              </div>
              {!events.length && (
                <p className="border border-white/10 p-8 text-sm text-[#9ba6af]">
                  {run.trace_available
                    ? "No entries match these filters."
                    : "No sealed native trace was published for this attempt."}
                </p>
              )}
              {events.length > limit && (
                <button
                  type="button"
                  className={`${buttonClass} mt-5`}
                  onClick={() => setLimit(limit + 100)}
                >
                  Show next 100 entries
                </button>
              )}
            </>
          )}
          {tab === "Agents" && (
            <div className="space-y-3">
              {run.agents.map((a) => (
                <article key={a.id} className={panelClass}>
                  <div className="flex flex-wrap justify-between gap-3">
                    <h2 className={titleClass}>
                      {a.profile}{" "}
                      <span className="text-[#9ba6af]">· {a.id}</span>
                    </h2>
                    <span className="text-xs text-[#8ccf9f]">{a.status}</span>
                  </div>
                  <p className="mt-3 text-xs text-[#9ba6af]">
                    {a.parent_id
                      ? `Spawned by ${a.parent_id}`
                      : "Root controller"}{" "}
                    · {a.tool_calls} tool calls
                  </p>
                  {a.task && <Payload label="Assigned task" text={a.task} />}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {a.tools.map((t) => (
                      <span
                        key={t.name}
                        className="border border-white/10 px-3 py-2 font-mono text-xs text-[#9ba6af]"
                      >
                        {t.name} <b className="text-[#d5dde3]">{t.count}</b>
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className={`${buttonClass} mt-4`}
                    onClick={() => {
                      setAgent(a.id);
                      setKind("all");
                      setSearch("");
                      setLimit(100);
                      setTab("Timeline");
                    }}
                  >
                    Inspect this agent’s timeline
                  </button>
                </article>
              ))}
              {run.agents.length === 1 && (
                <p className="text-xs text-[#9ba6af]">
                  No child agents are recorded in this attempt.
                </p>
              )}
            </div>
          )}
          {tab === "Requests" && (
            <div className="space-y-3">
              {run.requests.map((r, i) => (
                <article key={r.id} className={panelClass}>
                  <h2 className={titleClass}>
                    Request {i + 1} · {r.status}
                  </h2>
                  <p className="mt-3 break-words text-xs text-[#9ba6af]">
                    {r.model} · effort: {r.reasoning_effort ?? "Not recorded"} ·
                    provider: {r.providers.join(", ") || "Not recorded"}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                    <Stat label="First byte" value={seconds(r.first_byte_s)} />
                    <Stat
                      label="Request elapsed"
                      value={seconds(r.elapsed_s)}
                    />
                    <Stat
                      label="Admission queue"
                      value={seconds(r.admission_queue_s)}
                    />
                    <Stat
                      label="Provider usage tokens"
                      value={r.usage?.total_tokens ?? "Unavailable"}
                    />
                  </div>
                  <p className="mt-4 text-xs text-[#9ba6af]">
                    {r.message_count} messages sent ·{" "}
                    {r.response.tool_calls.length} returned tool calls
                  </p>
                  <Payload label="Model response" text={r.response.text} />
                  <Payload
                    label="Returned reasoning"
                    text={
                      r.response.reasoning ||
                      "No reasoning text returned or recorded. This does not prove thinking was disabled."
                    }
                  />
                  {r.response.tool_calls.map((c, j) => (
                    <Payload
                      key={`${c.id}-${j}`}
                      label={`Wire tool call · ${c.name}`}
                      text={c.arguments}
                    />
                  ))}
                </article>
              ))}
              {!run.requests.length && (
                <p className="text-xs text-[#9ba6af]">
                  No broker request records published.
                </p>
              )}
            </div>
          )}
          {tab === "Grading" && (
            <>
              <p className="mb-4 text-xs leading-6 text-[#9ba6af]">
                Executable checks determine the benchmark grade. Model claims
                and review verdicts do not.{" "}
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
                    <p className="mt-3 break-words font-mono text-xs text-[#d5dde3]">
                      {c.command}
                    </p>
                    <Payload label="Check output" text={c.output} />
                  </article>
                ))}
              </div>
              <Payload
                label="Full grading evidence (rubric / mutations / checks)"
                text={JSON.stringify(run.grading, null, 2)}
              />
            </>
          )}
          {tab === "Diff" && (
            <div className={panelClass}>
              <h2 className={titleClass}>Submitted patch</h2>
              {run.patch ? (
                <pre className="mt-5 max-h-[600px] overflow-auto font-mono text-xs leading-6 whitespace-pre-wrap break-words text-[#c3cbd1]">
                  {run.patch}
                </pre>
              ) : (
                <p className="mt-4 text-xs text-[#9ba6af]">
                  No patch was submitted.
                </p>
              )}
            </div>
          )}
        </section>
        <footer className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-6">
          <a
            href={`${artifactBase}/view.json`}
            download
            className={buttonClass}
          >
            Normalized trace JSON ↓
          </a>
          <a
            href={`${artifactBase}/result.json`}
            download
            className={buttonClass}
          >
            Result JSON ↓
          </a>
          <a
            href={`${artifactBase}/patch.diff`}
            download
            className={buttonClass}
          >
            Patch ↓
          </a>
        </footer>
      </main>
      <SiteFooter product={product} />
    </ProductShell>
  );
}
