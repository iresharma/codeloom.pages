import { cn } from "../lib/utils";

export function Lamp({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-x-0 top-0 isolate h-48 overflow-hidden", className)} aria-hidden>
      <div
        className="absolute left-1/2 top-0 h-40 w-[40rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "var(--product-glow, rgba(245,158,11,0.28))" }}
      />
      <div
        className="absolute left-1/2 top-8 h-px w-72 -translate-x-1/2"
        style={{
          background: `linear-gradient(90deg, transparent, var(--product-from, #ffaa40), var(--product-to, #9c40ff), transparent)`,
        }}
      />
      <div
        className="absolute left-1/2 top-8 h-24 w-56 -translate-x-1/2 opacity-70 blur-2xl"
        style={{
          background: `conic-gradient(from 180deg at 50% 0%, transparent 0deg, var(--product-from, #ffaa40) 40deg, transparent 90deg)`,
        }}
      />
    </div>
  );
}
