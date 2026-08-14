import { PRODUCTS } from "@codeloom/config";

import { BorderBeam } from "../magic/border-beam";

const product = PRODUCTS.tui;

const tree = [
  { label: "codeloom-tui/", dim: true },
  { label: "├─ src/", dim: true },
  { label: "│  ├─ explorer.rs", active: true },
  { label: "│  ├─ viewer.rs", dim: false },
  { label: "│  └─ agent.rs", dim: false },
  { label: "└─ Cargo.toml", dim: false },
];

export function TuiMock() {
  return (
    <div className="relative mx-auto max-w-4xl">
      <div className="absolute -inset-8 rounded-[32px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.18),transparent_70%)] blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#07110c] font-mono shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
        <BorderBeam colorFrom={product.accent.from} colorTo={product.accent.to} size={140} />
        <div className="flex items-center justify-between border-b border-emerald-500/20 px-4 py-2 text-[11px] text-emerald-200/70">
          <span>NVIM  ·  codeloom-tui</span>
          <span>NORMAL  ·  explorer.rs  ·  utf-8</span>
        </div>
        <div className="grid min-h-[320px] grid-cols-1 md:grid-cols-[13rem_1fr_14rem]">
          <aside className="border-b border-emerald-500/15 p-3 text-left text-[12px] text-emerald-100/80 md:border-b-0 md:border-r">
            <p className="mb-2 text-[10px] tracking-[0.2em] text-emerald-500/70">NETRW</p>
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
              <span className="text-emerald-300">pub fn</span> open_file(path: &Path) {"{"}
            </div>
            <div>
              <span className="text-emerald-700">  2 </span>
              {"  "}let buf = fs::read_to_string(path)?;
            </div>
            <div>
              <span className="text-emerald-700">  3 </span>
              {"  "}viewer::render(buf, Syntax::Rust)
            </div>
            <div>
              <span className="text-emerald-700">  4 </span>
              {"}"}
            </div>
            <div className="mt-6 text-emerald-500/70">-- 4 lines  ·  rust  ·  unix</div>
          </pre>
          <aside className="p-3 text-left text-[12px] text-emerald-100/85">
            <p className="mb-2 text-[10px] tracking-[0.2em] text-emerald-500/70">AGENT</p>
            <p className="text-emerald-200/90">Wire explorer selection into the file viewer, keep focus in the tree.</p>
            <p className="mt-3 text-emerald-100/50">thinking · patching explorer.rs</p>
            <p className="mt-4 text-emerald-400">:CodeLoom ask  ▍</p>
          </aside>
        </div>
      </div>
    </div>
  );
}
