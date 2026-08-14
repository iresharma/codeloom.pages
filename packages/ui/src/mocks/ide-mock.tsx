import { PRODUCTS } from "@codeloom/config";

import { BorderBeam } from "../magic/border-beam";

const product = PRODUCTS.ide;

const files = ["src/app.tsx", "src/agent.ts", "src/composer.tsx", "package.json"];

const code = [
  { n: 12, t: "export function Composer({ repo }: Props) {", c: "text-zinc-200" },
  { n: 13, t: "  const files = useWorkspaceIndex(repo)", c: "text-zinc-200" },
  { n: 14, t: "  const plan = await agent.plan(prompt, files)", c: "text-violet-300" },
  { n: 15, t: "  return <DiffStream plan={plan} />", c: "text-zinc-200" },
  { n: 16, t: "}", c: "text-zinc-200" },
];

export function IdeMock() {
  return (
    <div className="relative mx-auto max-w-4xl">
      <div className="absolute -inset-8 rounded-[32px] bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.2),transparent_70%)] blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b10] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
        <BorderBeam colorFrom={product.accent.from} colorTo={product.accent.to} size={140} />
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-[11px] text-zinc-500">codeloom-ide — src/composer.tsx</span>
        </div>
        <div className="grid min-h-[320px] grid-cols-[3.5rem_1fr] md:grid-cols-[3.5rem_11rem_1fr_14rem]">
          <div className="hidden flex-col items-center gap-4 border-r border-white/10 py-4 text-zinc-500 md:flex">
            <span className="text-[10px]">⌘</span>
            <span className="text-[10px]">≡</span>
            <span className="text-[10px]">⌕</span>
            <span className="rounded bg-violet-500/20 px-1 text-[10px] text-violet-300">AI</span>
          </div>
          <aside className="hidden border-r border-white/10 p-3 text-left text-[12px] md:block">
            <p className="mb-2 text-[10px] tracking-widest text-zinc-500 uppercase">Explorer</p>
            {files.map((file, i) => (
              <div
                key={file}
                className={
                  i === 2
                    ? "rounded bg-violet-500/15 px-2 py-1 text-violet-200"
                    : "px-2 py-1 text-zinc-400"
                }
              >
                {file}
              </div>
            ))}
          </aside>
          <pre className="overflow-auto p-4 text-left font-mono text-[12px] leading-6">
            {code.map((line) => (
              <div key={line.n} className="flex gap-4">
                <span className="w-6 text-right text-zinc-600">{line.n}</span>
                <span className={line.c}>{line.t}</span>
              </div>
            ))}
            <div className="mt-3 rounded-md border border-violet-400/30 bg-violet-500/10 px-3 py-2 text-[11px] text-violet-100">
              Agent · rewrite Composer to stream diffs and keep the file tree in sync.
            </div>
          </pre>
          <aside className="hidden border-l border-white/10 p-3 text-left text-[12px] md:block">
            <p className="mb-2 text-[10px] tracking-widest text-zinc-500 uppercase">Chat</p>
            <div className="rounded-lg bg-white/5 p-3 text-zinc-300">
              I indexed 214 files. Composer can now stream the plan into the diff view.
            </div>
            <div className="mt-3 text-[11px] text-zinc-500">Accept · Reject · Ask</div>
          </aside>
        </div>
      </div>
    </div>
  );
}
