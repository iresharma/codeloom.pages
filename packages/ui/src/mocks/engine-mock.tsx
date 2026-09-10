"use client";

import { PRODUCT_LIST } from "@codeloom/config";
import { motion, useReducedMotion } from "motion/react";

const spokes = [
  { id: "agent", x: 13.5, y: 16, hint: "SubmitUserMessage", duration: 3.2, delay: 0 },
  { id: "ide", x: 86.5, y: 16, hint: "OpenFile", duration: 3.6, delay: 0.4 },
  { id: "tui", x: 13.5, y: 84, hint: "RequestGit", duration: 4.0, delay: 0.8 },
  { id: "cli", x: 86.5, y: 84, hint: "StartSession", duration: 4.4, delay: 1.2 },
] as const;

const HUB = { x: 50, y: 50 };

export function EngineMock() {
  const reduce = useReducedMotion();
  const clients = spokes.map((s) => ({ ...s, product: PRODUCT_LIST.find((p) => p.id === s.id) }));

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex items-center justify-between px-6 py-3 font-mono text-[10px] tracking-[0.15em] text-[#8ab4c8] uppercase">
        <span>topology</span>
        <span className="text-[#f2c14e]">fan-out</span>
      </div>

      <div className="relative min-h-[15rem] flex-1 overflow-hidden px-6">
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          {clients.map((c) => (
            <line
              key={c.id}
              x1={HUB.x}
              y1={HUB.y}
              x2={c.x}
              y2={c.y}
              stroke="#ff5c33"
              strokeOpacity={0.25}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {!reduce ? (
            <>
              <motion.span
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-[#ff5c33]/50"
                animate={{ width: [24, 88], height: [24, 88], opacity: [0.5, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.span
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-[#ff5c33]/50"
                animate={{ width: [24, 88], height: [24, 88], opacity: [0.5, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 1.2 }}
              />
            </>
          ) : (
            <span className="absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 border border-[#ff5c33]/30" />
          )}
          <div className="relative flex size-16 flex-col items-center justify-center gap-0.5 bg-[#ff5c33] text-center">
            <span className="font-display text-[10px] font-black tracking-wider text-[#0c1014] uppercase">
              Engine
            </span>
          </div>
        </div>

        {clients.map((c) => (
          <a
            key={c.id}
            href={c.product?.href}
            style={{ left: `${c.x}%`, top: `${c.y}%` }}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
          >
            <div className="w-[6.5rem] bg-[#080b0e] px-2.5 py-2 text-center transition-colors duration-200 group-hover:bg-[#ff5c33]/10">
              <p className="font-mono text-[11px] tracking-[0.15em] text-[#ece8e1] uppercase">
                {c.product?.shortName ?? c.id}
              </p>
              <p className="mt-1 truncate font-mono text-[9px] text-[#8ab4c8]">{c.hint}</p>
            </div>
          </a>
        ))}

        {!reduce
          ? clients.map((c) => (
              <motion.span
                key={`packet-${c.id}`}
                className="absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                animate={{
                  left: [`${c.x}%`, `${HUB.x}%`, `${c.x}%`],
                  top: [`${c.y}%`, `${HUB.y}%`, `${c.y}%`],
                  backgroundColor: ["#ff5c33", "#f2c14e", "#ff5c33"],
                }}
                transition={{ duration: c.duration, delay: c.delay, repeat: Infinity, ease: "easeInOut" }}
              />
            ))
          : null}
      </div>

      <div className="flex items-center justify-between border-t border-white/10 px-6 py-3 font-mono text-[10px] tracking-[0.15em] text-[#8ab4c8] uppercase">
        <span>sqlite · openrouter</span>
        <span className="text-[#f2c14e]">16-turn tools</span>
      </div>
    </div>
  );
}
