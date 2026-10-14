import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { benchmarkRunIndex, RunInspector, type RunView } from "@codeloom/ui";

export const dynamicParams = true;

const monitor = process.env.BENCHMARK_MONITOR_URL ?? "https://benchmark-monitor-production.up.railway.app";

async function entryFor(run: string, attempt: string) {
  if (["railway-v1", "railway-calibration"].includes(run)) {
    try {
      const response = await fetch(`${monitor}/api/status`, { cache: "no-store" });
      if (!response.ok) return undefined;
      const snapshot = await response.json();
      return (snapshot.runs as typeof benchmarkRunIndex).find((e) => e.run_id === run && e.id === attempt);
    } catch { return undefined; }
  }
  return benchmarkRunIndex.find((e) => e.run_id === run && e.id === attempt);
}

export function generateStaticParams() {
  return benchmarkRunIndex.map((entry) => ({
    run: entry.run_id,
    attempt: entry.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ run: string; attempt: string }>;
}) {
  const { run, attempt } = await params;
  const entry = await entryFor(run, attempt);
  return {
    title: entry ? `${entry.task_id} · ${entry.system} run` : "Run not found",
  };
}

export default async function RunPage({
  params,
}: {
  params: Promise<{ run: string; attempt: string }>;
}) {
  const { run, attempt } = await params;
  const entry = await entryFor(run, attempt);
  if (!entry) notFound();
  if (["railway-v1", "railway-calibration"].includes(run)) {
    const response = await fetch(`${monitor}${entry.artifact_base}/view.json`, { cache: "no-store" });
    if (!response.ok) notFound();
    const view: RunView = await response.json();
    return <RunInspector run={view} artifactBase={entry.artifact_base} />;
  }
  const file = path.join(
    process.cwd(),
    "public",
    `${entry.artifact_base}/view.json`,
  );
  const view: RunView = JSON.parse(await readFile(file, "utf8"));
  return <RunInspector run={view} artifactBase={entry.artifact_base} />;
}
