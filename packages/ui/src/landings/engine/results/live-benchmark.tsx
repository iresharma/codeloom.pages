"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import summary from "./data/benchmark.json";
import setup from "./data/setup.json";
import runs from "./data/run-index.json";
import type { Summary } from "./benchmark-panel";

type Worker = {
  phase: string;
  message: string;
  received_at?: number;
  active?: { id: string; task_id: string; system: string; stage: string; requests: number }[];
  budget?: { spent_or_reserved_usd: number; unknown_calls: number; overrun: boolean };
  log?: string[];
};
type Snapshot = {
  summary: Summary;
  setup: typeof setup;
  runs: typeof runs;
  worker: Worker | null;
  connected: boolean;
  paused: boolean;
  toggle: () => void;
};
const initial = { summary: summary as Summary, setup, runs, worker: null, connected: false, paused: false, toggle: () => {} };
const Context = createContext<Snapshot>(initial);
export const useBenchmarkSnapshot = () => useContext(Context);

export function LiveBenchmarkProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState(initial as Snapshot);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    let stream: EventSource | undefined;
    const accept = (value: Partial<Snapshot>) => {
      setSnapshot((old) => ({ ...old, ...value, summary: value.summary ?? old.summary, setup: value.setup ?? old.setup, runs: value.runs ?? old.runs, connected: true }));
    };
    const open = () => {
      stream?.close();
      if (document.hidden) return;
      stream = new EventSource("/api/benchmark/events");
      stream.onmessage = (event) => {
        try { accept(JSON.parse(event.data)); } catch { setSnapshot((old) => ({ ...old, connected: false })); }
      };
      stream.onerror = () => setSnapshot((old) => ({ ...old, connected: false }));
    };
    open();
    document.addEventListener("visibilitychange", open);
    return () => { stream?.close(); document.removeEventListener("visibilitychange", open); };
  }, [paused]);
  return <Context.Provider value={{ ...snapshot, paused, toggle: () => setPaused((old) => !old) }}>{children}</Context.Provider>;
}

export function LiveBenchmarkStatus() {
  const { worker, connected, paused, toggle } = useBenchmarkSnapshot();
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 10000); return () => clearInterval(timer); }, []);
  const stale = !!worker?.received_at && now / 1000 - worker.received_at > 90 && !["complete", "blocked"].includes(worker.phase);
  return <section className="border-b border-white/10 py-6" aria-label="Live Railway campaign">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="font-mono text-sm text-[#d5dde3]">Railway campaign · {worker?.phase.replaceAll("_", " ") ?? "connecting"}</h2>
      <button type="button" onClick={toggle} aria-pressed={paused} className="min-h-11 border border-white/15 px-4 text-xs text-[#d5dde3] hover:border-[#ff5c33] focus-visible:outline-2 focus-visible:outline-[#ff5c33]">{paused ? "Resume updates" : "Pause updates"}</button>
    </div>
    <p className="mt-2 text-sm text-[#9ba6af]" role="status">{worker?.message ?? "Loading current worker status. The recorded results below remain available."}</p>
    <p className="mt-2 text-xs text-[#e2bd6b]">{paused ? "Updates paused" : stale ? "Worker heartbeat stale · showing last saved state" : connected ? "Connected" : "Reconnecting · showing last saved state"}{worker?.received_at ? ` · Updated ${new Date(worker.received_at * 1000).toLocaleTimeString()}` : ""}</p>
    {worker?.budget && <p className="mt-3 font-mono text-xs text-[#d5dde3]">Campaign spent / reserved: ${worker.budget.spent_or_reserved_usd.toFixed(3)} · {worker.budget.unknown_calls} pending or unknown bills · $50 total ceiling</p>}
    {worker?.active?.map((attempt) => <p key={attempt.id} className="mt-2 font-mono text-xs text-[#7eb5d0]">{attempt.task_id} · {attempt.system} · {attempt.stage} · {attempt.requests} requests</p>)}
    <a className="mt-2 inline-flex min-h-11 items-center text-xs text-[#7eb5d0] underline focus-visible:outline-2 focus-visible:outline-[#ff5c33]" href="https://benchmark-monitor-production.up.railway.app">Open standalone live monitor ↗</a>
    {!!worker?.log?.length && <details className="mt-1 text-xs text-[#9ba6af]"><summary className="min-h-11 cursor-pointer py-3">Current setup activity</summary><pre className="overflow-x-auto whitespace-pre-wrap break-words leading-6">{worker.log.join("\n")}</pre></details>}
  </section>;
}
