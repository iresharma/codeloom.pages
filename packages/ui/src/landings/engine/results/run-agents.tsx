"use client";

import { useMemo, useState } from "react";
import type { RunView } from "./run-types";
import { buttonClass, focusClass, Payload, statusColor } from "./run-ui";

export function RunAgents({
  run,
  onInspectTimeline,
}: {
  run: RunView;
  onInspectTimeline: (id: string) => void;
}) {
  const [selected, setSelected] = useState(run.agents[0]?.id);
  const byId = useMemo(
    () => new Map(run.agents.map((a) => [a.id, a])),
    [run.agents],
  );
  const agent = byId.get(selected);
  const events = useMemo(
    () => run.timeline.filter((e) => e.agent_id === selected),
    [run.timeline, selected],
  );
  const outcome = [...events]
    .reverse()
    .find(
      (e) =>
        ((e.kind === "agent" && e.title === "Agent finished") ||
          (e.kind === "message" && e.title === "assistant")) &&
        e.detail &&
        e.detail !== "null",
    )?.detail;
  const prompt =
    agent?.task ||
    events.find((e) => e.kind === "message" && e.title === "user")?.detail;
  const depth = (id: string) => {
    const seen = new Set<string>();
    let parent = byId.get(id)?.parent_id;
    while (parent && byId.has(parent) && !seen.has(parent) && parent !== id) {
      seen.add(parent);
      parent = byId.get(parent)?.parent_id;
    }
    return Math.min(seen.size, 3);
  };
  if (!agent)
    return <p className="text-sm text-[#9ba6af]">No agents recorded.</p>;
  return (
    <div className="grid items-start gap-4 md:grid-cols-[260px_minmax(0,1fr)]">
      <div className="border border-white/10">
        <div className="border-b border-white/10 px-4 py-3 text-xs text-[#9ba6af]">
          {run.agents.length} agents · recorded parent hierarchy
        </div>
        <div
          className="max-h-[36rem] overflow-auto p-2"
          role="group"
          aria-label="Recorded agents"
        >
          {run.agents.map((a, i) => (
            <button
              type="button"
              key={a.id}
              aria-pressed={selected === a.id}
              onClick={() => setSelected(a.id)}
              className={`mb-1 w-full border-l-2 px-3 py-3 text-left ${focusClass} ${selected === a.id ? "border-[#ff5c33] bg-[#ff5c33]/10" : "border-transparent hover:bg-white/5"}`}
              style={{ paddingLeft: `${12 + depth(a.id) * 14}px` }}
            >
              <span className="flex items-center justify-between gap-2 font-mono text-xs text-[#d5dde3]">
                <span>
                  {a.parent_id ? "↳ " : ""}
                  {a.profile}
                </span>
                <span className="text-[#9ba6af]">{a.tool_calls} calls</span>
              </span>
              <span className="mt-1 flex items-center justify-between gap-2 font-mono text-[11px]">
                <span className="truncate text-[#9ba6af]">
                  {a.id === "root" ? "root" : `#${i} · ${a.id.slice(0, 8)}`}
                </span>
                <span className={statusColor(a.status)}>{a.status}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
      <article
        className="min-w-0 border border-white/10 bg-white/[0.02] p-5"
        aria-label="Selected agent details"
      >
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-mono text-sm text-[#d5dde3]">{agent.profile}</h2>
          <span className={`font-mono text-xs ${statusColor(agent.status)}`}>
            {agent.status}
          </span>
        </header>
        <p className="mt-2 break-all font-mono text-xs text-[#9ba6af]">
          {agent.id}
        </p>
        <div className="my-5 grid grid-cols-3 gap-3 border-y border-white/10 py-4 text-xs">
          <div>
            <p className="text-[#9ba6af]">Parent</p>
            <p className="mt-1 text-[#d5dde3]">
              {byId.get(agent.parent_id ?? "")?.profile ??
                (agent.parent_id || "Root controller")}
            </p>
          </div>
          <div>
            <p className="text-[#9ba6af]">Tool calls</p>
            <p className="mt-1 font-mono text-[#d5dde3]">{agent.tool_calls}</p>
          </div>
          <div>
            <p className="text-[#9ba6af]">Events</p>
            <p className="mt-1 font-mono text-[#d5dde3]">{events.length}</p>
          </div>
        </div>
        <h3 className="text-xs text-[#9ba6af]">Assigned task</h3>
        <pre className="mt-2 max-h-44 overflow-auto font-mono text-xs leading-5 whitespace-pre-wrap break-words text-[#c3cbd1]">
          {prompt || "No task text recorded."}
        </pre>
        {agent.tools.length > 0 && (
          <div className="my-5 flex max-h-32 flex-wrap gap-2 overflow-auto">
            {agent.tools.map((t) => (
              <span
                key={t.name}
                className="border border-white/10 px-2 py-1 font-mono text-[11px] text-[#9ba6af]"
              >
                {t.name} <b className="text-[#d5dde3]">{t.count}</b>
              </span>
            ))}
          </div>
        )}
        {outcome && <Payload label="Recorded outcome" text={outcome} />}
        <button
          type="button"
          className={`${buttonClass} mt-4`}
          onClick={() => onInspectTimeline(agent.id)}
        >
          View agent timeline →
        </button>
        {run.agents.length === 1 && (
          <p className="mt-4 text-xs text-[#9ba6af]">
            No child agents recorded.
          </p>
        )}
      </article>
    </div>
  );
}
