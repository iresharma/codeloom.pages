import { BorderBeam } from "../magic/border-beam";

const tree = [
  { label: "codeloom.TUI/", dim: true },
  { label: "├─ internal/", dim: true },
  { label: "│  ├─ tui/app.go", active: true },
  { label: "│  ├─ tui/graph.go", dim: false },
  { label: "│  └─ protocol/protocol.go", dim: false },
  { label: "├─ main.go", dim: false },
  { label: "└─ go.mod", dim: false },
];

export function TuiMock() {
  return (
    <div className="relative mx-auto max-w-4xl">
      <div className="absolute -inset-8 rounded-[32px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.18),transparent_70%)] blur-2xl" />
      <div className="relative overflow-hidden rounded-sm border border-emerald-500/35 bg-[#07110c] font-mono shadow-[0_0_80px_-20px_rgba(16,185,129,0.45)]">
        <BorderBeam colorFrom="#34d399" colorTo="#22d3ee" size={140} />
        <div className="flex items-center justify-between border-b border-emerald-500/20 px-4 py-2 text-[11px] text-emerald-200/70">
          <span>CodeLoom TUI  ·  .engine/engine.sock</span>
          <span>NORMAL  ·  app.go  ·  go</span>
        </div>
        <div className="grid min-h-[320px] grid-cols-1 md:grid-cols-[14rem_1fr_14rem]">
          <aside className="border-b border-emerald-500/15 p-3 text-left text-[12px] text-emerald-100/80 md:border-b-0 md:border-r">
            <p className="mb-2 text-[10px] tracking-[0.2em] text-emerald-500/70">FILES</p>
            {tree.map((row) => (
              <div
                key={row.label}
                className={
                  row.active
                    ? "bg-emerald-400/15 px-1 text-emerald-200"
                    : row.dim
                      ? "px-1 text-emerald-100/40"
                      : "px-1"
                }
              >
                {row.label}
              </div>
            ))}
          </aside>
          <pre className="overflow-auto border-b border-emerald-500/15 p-4 text-left text-[12px] leading-6 text-emerald-50 md:border-b-0">
            <div>
              <span className="text-emerald-700">  1 </span>
              <span className="text-emerald-300">func</span> (m *Model) handleEvent(ev protocol.Event) tea.Cmd {"{"}
            </div>
            <div>
              <span className="text-emerald-700">  2 </span>
              {"  "}<span className="text-emerald-300">switch</span> ev.Type {"{"}
            </div>
            <div>
              <span className="text-emerald-700">  3 </span>
              {"  "}<span className="text-emerald-300">case</span> <span className="text-emerald-200">&quot;MemoryUpdated&quot;</span>:
            </div>
            <div>
              <span className="text-emerald-700">  4 </span>
              {"    "}m.refreshInspect()
            </div>
            <div>
              <span className="text-emerald-700">  5 </span>
              {"  "}{"}"}
            </div>
            <div className="mt-6 text-emerald-500/70">-- 5 lines  ·  go  ·  unix</div>
          </pre>
          <aside className="p-3 text-left text-[12px] text-emerald-100/85">
            <p className="mb-2 text-[10px] tracking-[0.2em] text-emerald-500/70">AGENT</p>
            <p className="text-emerald-200/90">Renders the engine&apos;s events — chat, tool calls, the agent graph — streamed over one Unix socket.</p>
            <p className="mt-3 text-emerald-100/50">idle · reading engine.sock</p>
            <p className="mt-4 text-emerald-400">:CodeLoom ask  ▍</p>
          </aside>
        </div>
      </div>
    </div>
  );
}
