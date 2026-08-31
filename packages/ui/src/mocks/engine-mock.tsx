"use client";

import { PRODUCT_LIST } from "@codeloom/config";
import { motion, useReducedMotion } from "motion/react";

import { BorderBeam } from "../magic/border-beam";

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
    <div className="relative">
      <div className="absolute -inset-8 bg-[radial-gradient(ellipse_at_center,rgba(255,92,51,0.16),transparent_70%)] blur-2xl" />
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden border border-[#ff5c33]/30 bg-[#080b0e] shadow-[0_40px_80px_-24px_rgba(0,0,0,0.85)]"
      >
        <BorderBeam colorFrom="#ff5c33" colorTo="#f2c14e" size={90} duration={9} borderWidth={1.2} />
        <div className="flex items-center justify-between border-b border-[#ff5c33]/20 px-4 py-2 font-mono text-[11px]">
          <span className="text-[#ff5c33]">.engine/engine.sock</span>
          <span className="text-[#8ab4c8]">NDJSON · unix · fan-out</span>
          <span className="text-[#f2c14e]">topology</span>
        </div>

        <div className="relative min-h-[16.5rem] overflow-hidden px-6 py-6">
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
                strokeOpacity={0.22}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {!reduce ? (
              <>
                <motion.span
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ff5c33]/50"
                  animate={{ width: [24, 88], height: [24, 88], opacity: [0.5, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.span
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ff5c33]/50"
                  animate={{ width: [24, 88], height: [24, 88], opacity: [0.5, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 1.2 }}
                />
              </>
            ) : (
              <span className="absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ff5c33]/30" />
            )}
            <div className="relative flex size-16 flex-col items-center justify-center gap-0.5 rounded-full border border-[#ff5c33]/60 bg-[#0c1014] text-center shadow-[0_0_30px_-4px_rgba(255,92,51,0.5)]">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff5c33] opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-[#ff5c33]" />
              </span>
              <span className="font-mono text-[9px] tracking-wider text-[#ece8e1]">ENGINE</span>
            </div>
          </div>

          {clients.map((c) => (
            <a
              key={c.id}
              href={c.product?.href}
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
            >
              <div className="w-[6.5rem] border border-[#ff5c33]/25 bg-[#0c1014]/90 px-2.5 py-2 text-center transition-colors duration-200 group-hover:border-[#ff5c33]/60 group-hover:bg-[#ff5c33]/5">
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

        <div className="grid grid-cols-3 border-t border-[#ff5c33]/20 font-mono text-[10px] uppercase tracking-wider text-[#8ab4c8]">
          <span className="border-r border-[#ff5c33]/20 px-3 py-2">sqlite sessions</span>
          <span className="border-r border-[#ff5c33]/20 px-3 py-2">openrouter</span>
          <span className="px-3 py-2 text-[#f2c14e]">8-turn tools</span>
        </div>
      </motion.div>
    </div>
  );
}
