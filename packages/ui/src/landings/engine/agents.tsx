"use client";

import { PRODUCTS } from "@codeloom/config";
import { motion, useReducedMotion } from "motion/react";

import { EngineChapterNav, SiteFooter } from "../../chrome/footer";
import { SiteNav } from "../../chrome/site-nav";
import { EngineSubNav } from "../../chrome/engine-subnav";
import { ProductShell } from "../../components/product-shell";
import { Reveal } from "../../magic/reveal";
import { EngineAgentsFlow } from "../../mocks/engine-agents-flow";
import { EngineFold } from "../../mocks/engine-fold";
import { knownLimits, personas, settleChoices, shipped } from "./data";

const product = PRODUCTS.engine;

export function EngineAgentsLanding() {
  const reduce = useReducedMotion();

  return (
    <ProductShell product={product} className="bg-[#0c1014]">
      <SiteNav active="engine" />
      <EngineSubNav active="agents" />

      <main className="mx-auto max-w-5xl px-5 md:px-8 xl:max-w-6xl">
        <section className="border-b border-white/10 py-14 md:py-20">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-[12px] tracking-[0.15em] text-[#7a848c] uppercase"
          >
            03 · agents
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            className="mt-2 font-mono text-2xl leading-snug font-bold text-[#d5dde3] sm:text-3xl"
          >
            It spawns. It isolates.
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mt-4 max-w-lg text-[14px] leading-6 text-[#7a848c]"
          >
            The orchestrator has no filesystem tools of its own — just spawn calls. Every writer works alone, on
            its own branch.
          </motion.p>
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.16, duration: 0.4 }}
            className="mt-6 text-[13px] leading-6 text-[#7a848c]"
          >
            [*] <strong className="text-[#d5dde3]">6</strong> named personas, up to{" "}
            <strong className="text-[#d5dde3]">8</strong> concurrent, sharing a{" "}
            <strong className="text-[#d5dde3]">120,000</strong>-token budget.
          </motion.p>
        </section>

        <section className="border-b border-white/10 py-10">
          <p className="font-mono text-[13px] font-bold text-[#d5dde3]">Six specialists.</p>
          <div className="mt-5 space-y-4">
            {personas.map((persona, i) => (
              <Reveal key={persona.name} delay={i * 0.03}>
                <div className="flex flex-col gap-0.5 text-[13px] sm:flex-row sm:gap-3">
                  <span className="shrink-0 font-mono font-bold text-[#ff5c33] sm:w-24">{persona.name}</span>
                  <span className="leading-6 text-[#7a848c]">
                    {persona.body} <span className="text-[#7a848c]/60">— {persona.worktree}</span>
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="border-b border-white/10 py-10">
          <p className="font-mono text-[13px] font-bold text-[#d5dde3]">How a request moves.</p>
          <p className="mt-2 max-w-lg text-[13px] leading-6 text-[#7a848c]">
            Readers stay on your checkout. A writer gets its own branch, and a tester and reviewer join it before
            anything is offered back to you.
          </p>
          <Reveal className="mt-6">
            <EngineAgentsFlow />
          </Reveal>
        </section>

        <section className="border-b border-white/10 py-10">
          <p className="font-mono text-[13px] font-bold text-[#d5dde3]">Nothing lands without you.</p>
          <p className="mt-2 max-w-lg text-[13px] leading-6 text-[#7a848c]">
            Writers finish on their own branch. You get one question back.
          </p>
          <div className="mt-5 space-y-2">
            {settleChoices.map((choice, i) => (
              <Reveal key={choice.id} delay={i * 0.03}>
                <div className="flex gap-3 text-[13px]">
                  <span className="w-20 shrink-0 font-mono text-[#d5dde3] uppercase">{choice.label}</span>
                  <span className="leading-6 text-[#7a848c]">{choice.body}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="border-b border-white/10 py-10">
          <p className="font-mono text-[13px] font-bold text-[#d5dde3]">One report, not thirty.</p>
          <p className="mt-2 max-w-lg text-[13px] leading-6 text-[#7a848c]">
            A child&apos;s tokens never reach the chat.{" "}
            <span className="font-mono text-[#d5dde3]">compress_for_parent</span> folds the transcript into one
            status report.
          </p>
          <div className="mt-6">
            <EngineFold />
          </div>
        </section>

        <section className="border-b border-white/10 py-10">
          <p className="font-mono text-[12px] tracking-[0.1em] text-[#7a848c] uppercase">Shipped</p>
          <ul className="mt-3 space-y-2 text-[13px] leading-6 text-[#7a848c]">
            {shipped.map((item) => (
              <li key={item}>[*] {item}</li>
            ))}
          </ul>
        </section>

        <section className="border-b border-white/10 py-8">
          <p className="font-mono text-[12px] tracking-[0.1em] text-[#7a848c] uppercase">Known limits</p>
          <ul className="mt-3 space-y-1.5 text-[13px] leading-6 text-[#7a848c]">
            {knownLimits.map((item) => (
              <li key={item}>[*] {item}</li>
            ))}
          </ul>
          <p className="mt-4 text-[13px] text-[#7a848c]">
            None of the six is a ceiling, either — a new persona is one file. See{" "}
            <a href="/engine/extend" className="text-[#ff5c33] underline underline-offset-4">
              extend
            </a>
            .
          </p>
        </section>

        <section className="flex flex-wrap items-center justify-between gap-4 py-10">
          <p className="font-mono text-[15px] font-bold text-[#d5dde3]">Clone it today.</p>
          <a
            href={product.github}
            target="_blank"
            rel="noreferrer"
            className="border border-white/15 px-4 py-2 font-mono text-[13px] text-[#d5dde3] transition-colors hover:border-[#ff5c33]/50 hover:text-[#ff5c33]"
          >
            github.com/iresharma/codeloom.engine
          </a>
        </section>
      </main>

      <EngineChapterNav active="agents" />
      <SiteFooter product={product} />
    </ProductShell>
  );
}
