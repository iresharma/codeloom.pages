import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { benchmarkRunIndex, RunInspector, type RunView } from "@codeloom/ui";

export const dynamicParams = false;

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
  const entry = benchmarkRunIndex.find(
    (e) => e.run_id === run && e.id === attempt,
  );
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
  const entry = benchmarkRunIndex.find(
    (e) => e.run_id === run && e.id === attempt,
  );
  if (!entry) notFound();
  const file = path.join(
    process.cwd(),
    "public",
    `${entry.artifact_base}/view.json`,
  );
  const view: RunView = JSON.parse(await readFile(file, "utf8"));
  return <RunInspector run={view} artifactBase={entry.artifact_base} />;
}
