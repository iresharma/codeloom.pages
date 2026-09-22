"use client";

import { PRODUCTS, PRODUCT_LIST } from "@codeloom/config";
import { motion, useReducedMotion } from "motion/react";

import { SiteFooter } from "../chrome/footer";
import { SiteNav } from "../chrome/site-nav";
import { ProductShell } from "../components/product-shell";
import { Reveal } from "../magic/reveal";

const product = PRODUCTS["cloud-controller"];
const others = PRODUCT_LIST.filter((item) => item.id !== product.id);

const pillars = [
  { n: "01", label: "provision", body: "Spin up a sandbox, clone the target repo, hand it an engine session." },
  { n: "02", label: "schedule", body: "Queue runs, stagger them across a fleet, respect a budget ceiling." },
  { n: "03", label: "supervise", body: "Watch the event stream, restart what dies, page you when it can't." },
  { n: "04", label: "settle", body: "Merge, PR, keep, or discard — routed back to you, not decided for you." },
];

export function CloudControllerLanding() {
  const reduce = useReducedMotion();

  return (
    <ProductShell product={product} className="bg-[#0c1014]">
      <SiteNav active="cloud-controller" />

      <main className="mx-auto max-w-3xl px-5 md:px-8">
        <section className="border-b border-white/10 py-14 md:py-20">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-[12px] tracking-[0.15em] text-[#38bdf8] uppercase"
          >
            Concept · not yet built
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            className="mt-2 font-mono text-2xl leading-snug font-bold text-[#d5dde3] sm:text-3xl"
          >
            The engine runs anywhere. Something has to watch it.
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mt-4 max-w-xl text-[14px] leading-6 text-[#7a848c]"
          >
            {product.description}
          </motion.p>
        </section>

        <section className="divide-y divide-white/10 border-b border-white/10">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.label} delay={i * 0.04}>
              <div className="flex items-baseline gap-4 py-5">
                <span className="font-mono text-[12px] text-[#7a848c]">{pillar.n}</span>
                <div>
                  <p className="font-mono text-[14px] font-bold text-[#d5dde3] uppercase">{pillar.label}</p>
                  <p className="mt-1 max-w-lg text-[13px] leading-6 text-[#7a848c]">{pillar.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </section>

        <section className="border-b border-white/10 py-10">
          <p className="font-mono text-[13px] font-bold text-[#d5dde3]">Why it's separate from the engine.</p>
          <p className="mt-2 max-w-xl text-[13px] leading-6 text-[#7a848c]">
            The engine already refuses to guess about anything that mutates git — settle is always your call, and a
            run degrades cleanly with no key, no model, no judge. The cloud controller doesn't get to relax that; it
            just gives that same discipline a fleet to run in, instead of one laptop with a terminal open.
          </p>
        </section>

        <section className="flex flex-wrap items-center gap-x-6 gap-y-2 py-8 font-mono text-[12px] text-[#7a848c]">
          <span className="uppercase tracking-[0.1em] text-[#7a848c]/70">also from codeloom</span>
          {others.map((item) => (
            <a key={item.id} href={item.path} className="transition-colors hover:text-[#38bdf8]">
              {item.shortName.toLowerCase()}
            </a>
          ))}
        </section>
      </main>

      <SiteFooter product={product} />
    </ProductShell>
  );
}
