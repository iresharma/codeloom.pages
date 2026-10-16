"use client";

export const buttonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 border border-white/15 px-4 py-2 text-xs text-[#c3cbd1] transition-colors hover:border-[#ff5c33] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5c33]";
export const selectClass =
  "min-h-11 w-full border border-white/15 bg-[#13191f] px-3 text-xs text-[#d5dde3] focus-visible:outline-2 focus-visible:outline-[#ff5c33]";
export const focusClass =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5c33]";
export const seconds = (n: number | null | undefined) =>
  n == null ? "—" : n < 1 ? `${Math.round(n * 1000)}ms` : `${n.toFixed(1)}s`;
export const elapsed = (n: number | null) =>
  n === null
    ? "—"
    : n < 60
      ? seconds(n)
      : `${Math.floor(Math.round(n) / 60)}m ${Math.round(n) % 60}s`;
export const money = (n: number | null | undefined) =>
  n == null ? "—" : `$${n.toFixed(4)}`;
export const statusColor = (status: string) =>
  ["ok", "completed", "complete", "passed"].includes(status)
    ? "text-[#8ccf9f]"
    : /error|fail|crash|exhausted/.test(status)
      ? "text-[#f28c79]"
      : "text-[#e2bd6b]";

export function Payload({ label, text }: { label: string; text: string }) {
  return (
    <details className="group/payload border-t border-white/10">
      <summary
        className={`min-h-11 cursor-pointer py-3 text-xs text-[#7eb5d0] ${focusClass}`}
      >
        {label}
      </summary>
      <pre className="mb-3 max-h-72 overflow-auto border border-white/10 bg-[#0a0d10] p-3 font-mono text-xs leading-5 whitespace-pre-wrap break-words text-[#c3cbd1]">
        {text || "No content recorded."}
      </pre>
    </details>
  );
}
