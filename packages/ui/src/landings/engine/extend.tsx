"use client";

import { PRODUCTS } from "@codeloom/config";
import { motion, useReducedMotion } from "motion/react";

import { EngineChapterNav, SiteFooter } from "../../chrome/footer";
import { SiteNav } from "../../chrome/site-nav";
import { EngineSubNav } from "../../chrome/engine-subnav";
import { ProductShell } from "../../components/product-shell";
import { Reveal } from "../../magic/reveal";
import { EngineExtend } from "../../mocks/engine-extend";
import { commands, extendPoints, lanes, toolFamilies } from "./data";

const product = PRODUCTS.engine;
const maxFamily = Math.max(...toolFamilies.map((f) => f.value));

export function EngineExtendLanding() {
  const reduce = useReducedMotion();

  return (
    <ProductShell product={product} className="bg-[#0c1014]">
      <SiteNav active="engine" />
      <EngineSubNav active="extend" />

      <main className="mx-auto max-w-3xl px-5 md:px-8">
        <section className="border-b border-white/10 py-14 md:py-20">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-[12px] tracking-[0.15em] text-[#7a848c] uppercase"
          >
            04 · extend
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            className="mt-2 font-mono text-2xl leading-snug font-bold text-[#d5dde3] sm:text-3xl"
          >
            Five surfaces. One rule.
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mt-4 max-w-lg text-[14px] leading-6 text-[#7a848c]"
          >
            Tools, the wire, subagents, transports, models — none of them are closed. Every one is a file: drop
            it, decorate or register it, restart the session. No registry to edit, no client to rebuild.
          </motion.p>
        </section>

        <section className="border-b border-white/10 py-10">
          <p className="font-mono text-[13px] font-bold text-[#d5dde3]">Tools — 32 shipped, ten families.</p>
          <p className="mt-2 max-w-lg text-[13px] leading-6 text-[#7a848c]">
            What ships today, not what&apos;s possible. A new family shows up the same way as the 32nd tool did.
          </p>
          <div className="mt-5 space-y-2.5">
            {toolFamilies.map((family, i) => (
              <Reveal key={family.label} delay={i * 0.02}>
                <div className="flex items-center gap-3 text-[12px]">
                  <span className="w-32 shrink-0 text-[#d5dde3]">{family.label}</span>
                  <span className="h-2 flex-1 bg-white/5">
                    <span
                      className="block h-full bg-[#7a848c]"
                      style={{ width: `${(family.value / maxFamily) * 100}%` }}
                    />
                  </span>
                  <span className="w-4 shrink-0 text-right font-mono text-[#d5dde3]">{family.value}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="border-b border-white/10 py-10">
          <p className="font-mono text-[13px] font-bold text-[#d5dde3]">The wire — 12 commands, 27 events.</p>
          <p className="mt-2 max-w-lg text-[13px] leading-6 text-[#7a848c]">
            A tool is a bet the model takes alone. A command or event is a promise every client depends on — it
            stays reviewable on purpose.
          </p>
          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            {lanes.map((lane, i) => (
              <Reveal key={lane.id} delay={i * 0.05}>
                <p className="font-mono text-[12px] tracking-[0.1em] text-[#7a848c] uppercase">{lane.sub}</p>
                <p className="mt-1 font-mono text-[15px] font-bold text-[#d5dde3]">{lane.label}</p>
                <p className="mt-2 text-[13px] leading-6 text-[#7a848c]">{lane.body}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 space-y-3">
            {commands.map((item, i) => (
              <Reveal key={item.name} delay={i * 0.015}>
                <div className="flex flex-col gap-0.5 text-[13px] sm:flex-row sm:gap-3">
                  <span className="shrink-0 font-mono text-[#ff5c33] sm:w-44">{item.name}</span>
                  <span className="leading-6 text-[#7a848c]">{item.meaning}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="border-b border-white/10 py-10">
          <p className="font-mono text-[13px] font-bold text-[#d5dde3]">Same rule, in code.</p>
          <p className="mt-2 max-w-lg text-[13px] leading-6 text-[#7a848c]">
            A tool and a command look almost nothing alike on the page — one is a decorator, the other a
            reviewable dataclass pair. The ceremony to ship either is still one file and a restart.
          </p>
          <div className="mt-5">
            <EngineExtend />
          </div>
        </section>

        <section className="py-10">
          <p className="font-mono text-[13px] font-bold text-[#d5dde3]">Three more surfaces.</p>
          <p className="mt-2 max-w-lg text-[13px] leading-6 text-[#7a848c]">
            The orchestrator, the transport, and the model behind it all extend the same way.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {extendPoints.map((point, i) => (
              <Reveal key={point.title} delay={i * 0.03}>
                <p className="font-mono text-[13px] font-bold text-[#d5dde3]">{point.title}</p>
                <p className="mt-1 text-[13px] leading-6 text-[#7a848c]">{point.body}</p>
                <pre className="mt-3 overflow-x-auto border border-white/10 bg-[#0a0d10] p-3 font-mono text-[12px] leading-6 text-[#d5dde3]">
                  {point.code}
                </pre>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-[13px] text-[#7a848c]">
            The personas themselves — what each one can and can&apos;t touch — are on{" "}
            <a href="/engine/agents" className="text-[#ff5c33] underline underline-offset-4">
              agents
            </a>
            .
          </p>
        </section>
      </main>

      <EngineChapterNav active="extend" />
      <SiteFooter product={product} />
    </ProductShell>
  );
}
