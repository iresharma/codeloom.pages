"use client";

import { PRODUCTS } from "@codeloom/config";
import { motion, useReducedMotion } from "motion/react";

import { EngineChapterNav, SiteFooter } from "../../chrome/footer";
import { SiteNav } from "../../chrome/site-nav";
import { EngineSubNav } from "../../chrome/engine-subnav";
import { ProductShell } from "../../components/product-shell";
import { Reveal } from "../../magic/reveal";
import { EngineReadLadder } from "../../mocks/engine-read-ladder";
import { readTiers } from "./data";

const product = PRODUCTS.engine;

export function EngineReadFunnelLanding() {
  const reduce = useReducedMotion();

  return (
    <ProductShell product={product} className="bg-[#0c1014]">
      <SiteNav active="engine" />
      <EngineSubNav active="read-funnel" />

      <main className="mx-auto max-w-5xl px-5 md:px-8 xl:max-w-6xl">
        <section className="border-b border-white/10 py-14 md:py-20">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-[12px] tracking-[0.15em] text-[#7a848c] uppercase"
          >
            01 · read funnel
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            className="mt-2 font-mono text-2xl leading-snug font-bold text-[#d5dde3] sm:text-3xl"
          >
            The cheapest tool that answers.
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mt-4 max-w-lg text-[14px] leading-6 text-[#7a848c]"
          >
            A model that reads code needs three different answers to &quot;what is this doing&quot; — one free, one
            instant, one that actually knows what a symbol is. Engine picks between them; it never guesses with
            just one.
          </motion.p>
        </section>

        <section className="border-b border-white/10 py-10">
          <p className="font-mono text-[13px] font-bold text-[#d5dde3]">Three tiers, cheapest first.</p>
          <div className="mt-6 space-y-8">
            {readTiers.map((tier, i) => (
              <Reveal key={tier.label} delay={i * 0.04}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-mono text-[15px] font-bold text-[#ff5c33] uppercase">
                    0{i + 1} · {tier.label}
                  </p>
                  <p className="font-mono text-[11px] whitespace-nowrap text-[#7a848c]">{tier.cost}</p>
                </div>
                <p className="mt-2 max-w-xl text-[13px] leading-6 text-[#7a848c]">{tier.body}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tier.tools.map((tool) => (
                    <span key={tool} className="border border-white/10 px-2 py-1 font-mono text-[11px] text-[#d5dde3]">
                      {tool}
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="border-b border-white/10 py-10">
          <p className="font-mono text-[13px] font-bold text-[#d5dde3]">Climbing in order.</p>
          <p className="mt-2 max-w-xl text-[13px] leading-6 text-[#7a848c]">
            <span className="text-[#d5dde3]">ask</span> and <span className="text-[#d5dde3]">coder</span> both
            follow the same cost hierarchy on every question:
          </p>
          <Reveal className="mt-5">
            <EngineReadLadder />
          </Reveal>
          <p className="mt-4 max-w-xl text-[13px] leading-6 text-[#7a848c]">
            find_symbol&apos;s coordinate is the handoff — it feeds the LSP tools directly, so the model is never
            asked to count characters itself.
          </p>
        </section>

        <section className="py-10">
          <p className="font-mono text-[13px] font-bold text-[#d5dde3]">Why three, not one.</p>
          <p className="mt-2 max-w-xl text-[13px] leading-6 text-[#7a848c]">
            Grep alone can&apos;t tell a symbol from a string, and burns context reading whole files to find one
            function. Tree-sitter alone can&apos;t tell you that the <span className="font-mono">parse_config</span>{" "}
            it just read is a <span className="italic">different</span> parse_config than the one three directories
            away. Only the language server knows that — and it costs seconds to ask.
          </p>
          <p className="mt-3 text-[13px] text-[#7a848c]">
            The full argument:{" "}
            <a
              href="https://blog.iresharma.com/why-a-coding-agent-needs-three-different-ways-to-read-code"
              target="_blank"
              rel="noreferrer"
              className="text-[#ff5c33] underline underline-offset-4"
            >
              why a coding agent needs three different ways to read code
            </a>
            .
          </p>
        </section>
      </main>

      <EngineChapterNav active="read-funnel" />
      <SiteFooter product={product} />
    </ProductShell>
  );
}
