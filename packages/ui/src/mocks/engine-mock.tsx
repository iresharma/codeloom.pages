"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { BorderBeam } from "../magic/border-beam";

const lines = [
  { dir: "→", kind: "cmd", event: "StartSession", body: 'workspace="/work/api"' },
  { dir: "←", kind: "evt", event: "SnapshotReady", body: "session=s_08f1  tree=214  git=main" },
  { dir: "→", kind: "cmd", event: "OpenFile", body: "path=src/auth.ts" },
  { dir: "←", kind: "evt", event: "FileContent", body: "src/auth.ts  148 lines" },
  { dir: "→", kind: "cmd", event: "SubmitUserMessage", body: '"fix the flaky auth test"' },
  { dir: "←", kind: "evt", event: "ChatMessageAdded", body: "role=assistant  one turn" },
  { dir: "→", kind: "cmd", event: "RequestGit", body: "" },
  { dir: "←", kind: "evt", event: "GitStateUpdated", body: "branch=main  dirty=true  unstaged=2" },
];

export function EngineMock() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(reduce ? lines.length : 0);

  useEffect(() => {
    if (reduce) return;
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      if (n > lines.length + 4) n = 0;
      setVisible(n);
    }, 520);
    return () => window.clearInterval(id);
  }, [reduce]);

  const shown = reduce ? lines : lines.slice(0, Math.min(visible, lines.length));

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
          <span className="text-[#f2c14e]">inspect</span>
        </div>
        <div className="relative min-h-[15.5rem] overflow-hidden px-4 py-3 font-mono text-[11px] leading-6 sm:text-[12px]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px animate-engine-scan bg-gradient-to-r from-transparent via-[#ff5c33] to-transparent"
          />
          {shown.map((line) => (
            <motion.p
              key={line.event}
              initial={reduce ? false : { opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.28 }}
              className="flex flex-wrap gap-x-3"
            >
              <span className="w-3 text-[#8ab4c8]/70">{line.dir}</span>
              <span className={line.kind === "cmd" ? "text-[#ff5c33]" : "text-[#f2c14e]"}>{line.event}</span>
              {line.body ? <span className="text-[#ece8e1]/80">{line.body}</span> : null}
            </motion.p>
          ))}
          <motion.p
            className="mt-1 text-[#ff5c33]"
            animate={reduce ? undefined : { opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            ▍ waiting on .engine/engine.sock
          </motion.p>
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
