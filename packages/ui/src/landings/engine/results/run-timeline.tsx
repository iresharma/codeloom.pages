"use client";

import { useDeferredValue, useMemo, useState } from "react";
import {
  AlertTriangle,
  GitBranch,
  MessageSquare,
  Wrench,
  CircleDot,
  ChevronRight,
} from "lucide-react";
import type { RunEvent, RunView } from "./run-types";
import {
  buttonClass,
  focusClass,
  Payload,
  seconds,
  selectClass,
} from "./run-ui";

const eventIcons = {
  tool: Wrench,
  message: MessageSquare,
  agent: GitBranch,
  error: AlertTriangle,
  event: CircleDot,
};

function preview(event: RunEvent) {
  if (event.kind === "tool") {
    try {
      const args = JSON.parse(event.detail);
      for (const key of [
        "command",
        "path",
        "file_path",
        "query",
        "task",
        "pattern",
      ]) {
        if (typeof args[key] === "string") return args[key];
      }
    } catch {
      /* Raw arguments remain available in the expanded event. */
    }
  }
  return event.detail && event.detail !== "null"
    ? event.detail
    : event.reasoning
      ? "Reasoning recorded · expand to read"
      : "No text content";
}

const emptyMessage = (event: RunEvent) =>
  event.kind === "message" &&
  (!event.detail.trim() || event.detail === "null") &&
  !event.reasoning;

function TimelineEntry({
  event,
  agent,
  outputPreview,
}: {
  event: RunEvent;
  agent: string;
  outputPreview: boolean;
}) {
  const [open, setOpen] = useState(false);
  const Icon = eventIcons[event.kind as keyof typeof eventIcons] ?? CircleDot;
  const failed = event.ok === false || event.kind === "error";
  const summary = preview(event).replace(/\s+/g, " ");
  return (
    <li className="relative pl-10">
      <span
        className={`absolute top-4 left-0 z-[1] flex size-6 items-center justify-center rounded-full border bg-[#0c1014] ${failed ? "border-[#f28c79]/40 text-[#f28c79]" : "border-white/20 text-[#7eb5d0]"}`}
      >
        <Icon className="size-3" aria-hidden="true" />
      </span>
      <details
        onToggle={(e) => setOpen(e.currentTarget.open)}
        className="group border-b border-white/10"
      >
        <summary
          aria-label={`Event ${event.sequence} · ${event.title} · ${agent}`}
          className={`min-h-11 cursor-pointer list-none px-2 py-3 hover:bg-white/[0.03] ${focusClass}`}
        >
          <div className="flex min-w-0 items-center gap-2 font-mono text-xs">
            <span className="shrink-0 text-[#9ba6af]">
              {String(event.sequence).padStart(3, "0")}
            </span>
            <span className="truncate text-[#d5dde3]">{event.title}</span>
            <span className="ml-auto shrink-0 text-[#9ba6af]">{agent}</span>
            {event.kind === "tool" && (
              <span
                className={`hidden shrink-0 sm:inline ${failed ? "text-[#f28c79]" : event.ok === true ? "text-[#8ccf9f]" : "text-[#9ba6af]"}`}
              >
                {event.ok == null ? "No result" : event.ok ? "OK" : "Failed"}
                {event.duration_ms != null
                  ? ` · ${seconds(event.duration_ms / 1000)}`
                  : ""}
              </span>
            )}
            <ChevronRight
              aria-hidden="true"
              className="size-3.5 shrink-0 text-[#9ba6af] transition-transform group-open:rotate-90 motion-reduce:transition-none"
            />
          </div>
          <p className="mt-1 truncate text-xs leading-5 text-[#9ba6af]">
            {summary.length > 180 ? `${summary.slice(0, 180)}…` : summary}
          </p>
        </summary>
        {open && (
          <div className="border-t border-white/5 px-2 pb-3">
            <p className="py-3 font-mono text-[11px] text-[#9ba6af]">
              {event.kind} · {event.agent_id}
              {event.duration_ms != null
                ? ` · ${seconds(event.duration_ms / 1000)}`
                : ""}
              {event.kind === "tool"
                ? ` · ${event.ok == null ? "Result unavailable" : event.ok ? "Succeeded" : "Failed"}`
                : ""}
            </p>
            <pre className="mb-3 max-h-64 overflow-auto bg-[#0a0d10] p-3 font-mono text-xs leading-5 whitespace-pre-wrap break-words text-[#c3cbd1]">
              {event.detail || "No content recorded."}
            </pre>
            {event.output != null && (
              <Payload
                label={outputPreview ? "Tool result preview" : "Tool result"}
                text={event.output}
              />
            )}
            {event.reasoning && (
              <Payload label="Returned reasoning" text={event.reasoning} />
            )}
          </div>
        )}
      </details>
    </li>
  );
}

export function RunTimeline({
  run,
  agent,
  onAgentChange,
}: {
  run: RunView;
  agent: string;
  onAgentChange: (id: string) => void;
}) {
  const [kind, setKind] = useState("all");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(100);
  const [showEmpty, setShowEmpty] = useState(false);
  const query = useDeferredValue(search.toLowerCase());
  const byId = useMemo(
    () =>
      new Map(
        run.agents.map((a, i) => [
          a.id,
          { ...a, label: a.id === "root" ? a.profile : `${a.profile} #${i}` },
        ]),
      ),
    [run.agents],
  );
  const matching = useMemo(
    () =>
      run.timeline.filter(
        (e) =>
          (agent === "all" || e.agent_id === agent) &&
          (kind === "all" || e.kind === kind) &&
          (!query ||
            `${e.title} ${e.detail} ${e.output ?? ""} ${e.reasoning ?? ""}`
              .toLowerCase()
              .includes(query)),
      ),
    [run.timeline, agent, kind, query],
  );
  const events = useMemo(
    () => (showEmpty ? matching : matching.filter((e) => !emptyMessage(e))),
    [matching, showEmpty],
  );
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="grid gap-2 text-xs text-[#9ba6af]">
          Agent
          <select
            className={selectClass}
            value={agent}
            onChange={(e) => {
              onAgentChange(e.target.value);
              setLimit(100);
            }}
          >
            <option value="all">All agents</option>
            {run.agents.map((a) => (
              <option key={a.id} value={a.id}>
                {byId.get(a.id)?.label} · {a.id.slice(0, 8)}
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
            {[...new Set(run.timeline.map((e) => e.kind))].map((k) => (
              <option key={k}>{k}</option>
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
      <div className="mt-4 border border-white/10">
        <div className="flex flex-wrap justify-between gap-2 border-b border-white/10 bg-[#13191f] px-4 py-3 text-xs text-[#9ba6af]">
          <p aria-live="polite">
            {events.length} events ·{" "}
            {agent === "all" ? "all agents" : byId.get(agent)?.label}
          </p>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={showEmpty}
              onChange={(e) => {
                setShowEmpty(e.target.checked);
                setLimit(100);
              }}
              className="size-4 accent-[#ff5c33]"
            />
            Show empty messages
          </label>
        </div>
        <div
          className={`h-[36rem] max-h-[70vh] overflow-auto px-4 py-2 ${focusClass}`}
          role="region"
          aria-label="Recorded event timeline"
          tabIndex={0}
        >
          {events.length ? (
            <ol className="relative before:absolute before:top-4 before:bottom-4 before:left-3 before:w-px before:bg-white/15">
              {events.slice(0, limit).map((e) => (
                <TimelineEntry
                  key={e.sequence}
                  event={e}
                  agent={byId.get(e.agent_id)?.label ?? e.agent_id.slice(0, 8)}
                  outputPreview={run.tool_output_is_preview}
                />
              ))}
            </ol>
          ) : (
            <p className="py-8 text-sm text-[#9ba6af]">
              {run.trace_available
                ? "No events match these filters."
                : "No sealed native trace was published for this attempt."}
            </p>
          )}
          {events.length > limit && (
            <button
              type="button"
              className={`${buttonClass} my-4 w-full`}
              onClick={() => setLimit((n) => n + 100)}
            >
              Load next {Math.min(100, events.length - limit)} events
            </button>
          )}
        </div>
        <p className="border-t border-white/10 px-4 py-3 text-xs text-[#9ba6af]">
          Showing {Math.min(events.length, limit)} of {events.length}
          {matching.length > events.length
            ? ` · ${matching.length - events.length} empty messages hidden`
            : ""}
          {" · Recorded order."}
          {run.tool_output_is_preview
            ? " · Tool outputs are recorded previews."
            : ""}
        </p>
      </div>
    </div>
  );
}
