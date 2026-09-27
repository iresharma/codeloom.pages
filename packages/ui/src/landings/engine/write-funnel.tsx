"use client";

import { PRODUCTS } from "@codeloom/config";
import { motion, useReducedMotion } from "motion/react";

import { EngineChapterNav, SiteFooter } from "../../chrome/footer";
import { SiteNav } from "../../chrome/site-nav";
import { EngineSubNav } from "../../chrome/engine-subnav";
import { ProductShell } from "../../components/product-shell";
import { Reveal } from "../../magic/reveal";
import { EngineLifecycle } from "../../mocks/engine-lifecycle";
import { EngineWriteDiagram } from "../../mocks/engine-write-diagram";
import { stages } from "./data";

const product = PRODUCTS.engine;

export function EngineWriteFunnelLanding() {
  const reduce = useReducedMotion();

  return (
    <ProductShell product={product} className="bg-[#0c1014]">
      <SiteNav active="engine" />
      <EngineSubNav active="write-funnel" />

      <main className="mx-auto max-w-5xl px-5 md:px-8 xl:max-w-6xl">
        <section className="border-b border-white/10 py-14 md:py-20">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-[12px] tracking-[0.15em] text-[#7a848c] uppercase"
          >
            02 · write funnel
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            className="mt-2 font-mono text-2xl leading-snug font-bold text-[#d5dde3] sm:text-3xl"
          >
            Six checks. Every write.
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mt-4 max-w-lg text-[14px] leading-6 text-[#7a848c]"
          >
            Reading is optimistic — try the cheap tool first. Writing isn&apos;t. A stale read, a bad patch, a
            syntax error nobody caught: nothing lands until all six checks pass.
          </motion.p>
        </section>

        <section className="border-b border-white/10 py-10">
          <div className="space-y-4">
            {stages.map((stage, i) => (
              <Reveal key={stage.label} delay={i * 0.03}>
                <div className="flex gap-3 text-[13px]">
                  <span className="w-6 shrink-0 font-mono text-[#7a848c]">0{i + 1}</span>
                  <span className="w-16 shrink-0 font-mono font-bold text-[#ff5c33] uppercase">{stage.label}</span>
                  <span className="leading-6 text-[#7a848c]">{stage.body}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="border-b border-white/10 py-10">
          <Reveal>
            <EngineWriteDiagram />
          </Reveal>
        </section>

        <section className="border-b border-white/10 py-10">
          <p className="font-mono text-[13px] font-bold text-[#d5dde3]">Three endings. One pipeline.</p>
          <Reveal delay={0.06} className="mt-5">
            <EngineLifecycle />
          </Reveal>
        </section>

        <section className="py-10">
          <p className="font-mono text-[12px] tracking-[0.15em] text-[#7a848c] uppercase">Scope, honestly</p>
          <p className="mt-3 max-w-2xl text-[13px] leading-6 text-[#7a848c]">
            The gate covers Python, Go, JavaScript, TypeScript. The model&apos;s own git tools are read-only — it
            can&apos;t script a commit. The one thing that mutates git is the{" "}
            <a href="/engine/agents" className="text-[#ff5c33] underline underline-offset-4">
              worktree settle step
            </a>
            , and that always waits on you first.
          </p>
          <p className="mt-3 max-w-2xl text-[13px] leading-6 text-[#7a848c]">
            25 test modules cover the runtime. 8 exercise the write funnel alone, offline, no LLM.
          </p>
        </section>
      </main>

      <EngineChapterNav active="write-funnel" />
      <SiteFooter product={product} />
    </ProductShell>
  );
}
