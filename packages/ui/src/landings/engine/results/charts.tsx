"use client";

export const chartColors = [
  "#ff5c33",
  "#7eb5d0",
  "#8ccf9f",
  "#e2bd6b",
  "#b49ae0",
  "#f28c79",
];
export const panelClass = "min-w-0 border border-white/10 bg-white/[0.02] p-5";
export const titleClass = "font-mono text-sm font-semibold text-[#d5dde3]";
export type Datum = { label: string; value: number; color?: string };

export function RingChart({
  items,
  value,
  label,
}: {
  items: Datum[];
  value: string;
  label: string;
}) {
  const total = items.reduce((n, item) => n + item.value, 0);
  let offset = 0;
  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg
        viewBox="0 0 160 160"
        className="h-40 w-40 shrink-0"
        role="img"
        aria-label={`${label}: ${value}. ${items.map((i) => `${i.label}: ${i.value}`).join(", ")}`}
      >
        <circle
          cx="80"
          cy="80"
          r="60"
          fill="none"
          stroke="#ffffff10"
          strokeWidth="14"
        />
        {items.map((item, i) => {
          const length = total ? (item.value / total) * 100 : 0;
          const start = offset;
          offset += length;
          return (
            <circle
              key={item.label}
              cx="80"
              cy="80"
              r="60"
              pathLength="100"
              fill="none"
              stroke={item.color ?? chartColors[i % chartColors.length]}
              strokeWidth="14"
              strokeDasharray={`${length} ${100 - length}`}
              strokeDashoffset={-start}
              transform="rotate(-90 80 80)"
            >
              <title>
                {item.label}: {item.value}
              </title>
            </circle>
          );
        })}
        <text
          x="80"
          y="78"
          textAnchor="middle"
          fill="#d5dde3"
          fontSize="28"
          fontFamily="monospace"
        >
          {value}
        </text>
        <text x="80" y="100" textAnchor="middle" fill="#9ba6af" fontSize="11">
          {label}
        </text>
      </svg>
      <ul className="min-w-[120px] flex-1 space-y-3 text-xs text-[#9ba6af]">
        {items.map((item, i) => (
          <li
            key={item.label}
            className="flex items-center justify-between gap-4"
          >
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0"
                style={{
                  background: item.color ?? chartColors[i % chartColors.length],
                }}
              />
              {item.label}
            </span>
            <b className="font-mono text-[#d5dde3]">{item.value}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BarChart({
  items,
  format = (n: number) => String(n),
  caption,
}: {
  items: Datum[];
  format?: (n: number) => string;
  caption: string;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <figure>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={item.label}>
            <div className="mb-2 flex justify-between gap-3 text-xs">
              <span className="break-words text-[#9ba6af]">{item.label}</span>
              <b className="shrink-0 font-mono text-[#d5dde3]">
                {format(item.value)}
              </b>
            </div>
            <div className="h-2 bg-white/5" aria-hidden="true">
              <div
                className="h-full"
                style={{
                  width: `${(item.value / max) * 100}%`,
                  background: item.color ?? chartColors[i % chartColors.length],
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <figcaption className="mt-4 text-xs leading-5 text-[#9ba6af]">
        {caption}
      </figcaption>
    </figure>
  );
}

export function Stat({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <div className="min-w-0 border border-white/10 p-4">
      <p className="break-words font-mono text-xl text-[#d5dde3]">{value}</p>
      <p className="mt-2 text-xs text-[#9ba6af]">{label}</p>
    </div>
  );
}
