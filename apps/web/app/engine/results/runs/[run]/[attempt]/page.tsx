import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { benchmarkRunIndex, RunInspector, type RunView } from "@codeloom/ui";

export const dynamic = "force-dynamic";

const monitor = process.env.BENCHMARK_MONITOR_URL ?? "https://benchmark-monitor-production.up.railway.app";

async function entryFor(run: string, attempt: string) {
  if (["railway-v1", "railway-calibration", "adapter-check"].includes(run)) {
    try {
      const response = await fetch(`${monitor}/api/status`, { cache: "no-store" });
      if (response.ok) {
        const snapshot = await response.json();
        const entry = (snapshot.runs as typeof benchmarkRunIndex).find((e) => e.run_id === run && e.id === attempt);
        if (entry) return entry;
      }
    } catch { /* The bundled historical inspector remains available. */ }
  }
  return benchmarkRunIndex.find((e) => e.run_id === run && e.id === attempt);
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
  if (entry.artifact_base.startsWith("/benchmarks/railway-")) {
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
