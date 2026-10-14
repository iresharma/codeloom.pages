const monitor = process.env.BENCHMARK_MONITOR_URL ?? "https://benchmark-monitor-production.up.railway.app";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ endpoint: string }> }) {
  const { endpoint } = await params;
  if (!["events", "status"].includes(endpoint)) return new Response("Not found", { status: 404 });
  try {
    const result = await fetch(`${monitor}/api/${endpoint}`, { cache: "no-store", signal: _request.signal });
    return new Response(result.body, { status: result.status, headers: { "Content-Type": result.headers.get("Content-Type") ?? "application/json", "Cache-Control": "no-store", "X-Accel-Buffering": "no" } });
  } catch {
    return Response.json({ error: "Benchmark monitor unavailable" }, { status: 503 });
  }
}
