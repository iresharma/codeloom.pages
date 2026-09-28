"use client";

import { AUTHOR, MOTHER_REPO, PERSONAL_LINKS, PRODUCT_LIST, type Product } from "@codeloom/config";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { SiteFooter } from "../chrome/footer";
import { SiteNav } from "../chrome/site-nav";
import { Reveal } from "../magic/reveal";

const statusLabel: Record<string, string> = {
  live: "shipping",
  "in-development": "in development",
  concept: "concept",
};

const preview: Record<Product["id"], { label: string; lines: string[] }> = {
  engine: {
    label: "unix socket",
    lines: ["$ python app.py .", "listening on .engine/engine.sock", "", "6 subagents · 32 tools · TypeSafe judge"],
  },
  "cloud-controller": {
    label: "fleet status",
    lines: ["3 sandboxes running · 1 queued", "budget: $12.40 / $50.00", "", "provision → schedule → supervise → settle"],
  },
  clients: {
    label: "same protocol, two renderers",
    lines: ["tui   :CodeLoom ask ▍", "web   RUN #1084 · live", "", "NDJSON commands + events, nothing else"],
  },
};

const detail: Record<Product["id"], string[]> = {
  engine: [
    "NDJSON over one Unix socket — every client reads the same stream.",
    "A write funnel with a syntax gate, full undo, and a TypeSafe judge layer.",
    "Orchestrator spawns 6 subagent personas into isolated git worktrees.",
  ],
  "cloud-controller": [
    "Provisions a sandbox per run, clones the target repo, hands it a session.",
    "Schedules and staggers runs across a fleet under a budget ceiling.",
    "Settle is still routed back to you — merge, PR, keep, or discard.",
  ],
  clients: [
    "A terminal workspace (TUI) and a web client: explorer, viewer, agent pane, modal by default.",
    "A Devin-style web interface: hand off a ticket, come back to a pull request.",
    "Neither talks to a model directly — both just render the engine's events.",
  ],
};

export function HomeLanding() {
  const reduce = useReducedMotion();

  return (
    <div className="theme-engine min-h-screen bg-[#0c1014] text-[#d5dde3]">
      <SiteNav active="home" />

      <main className="mx-auto max-w-5xl px-5 md:px-8">
        <section className="border-b border-white/10 py-14 md:py-20">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-[12px] tracking-[0.15em] text-[#7a848c] uppercase"
          >
            CodeLoom
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            className="mt-2 max-w-2xl font-mono text-3xl leading-snug font-bold text-[#d5dde3] sm:text-4xl"
          >
            One engine. One protocol. As many clients as you want.
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mt-4 max-w-xl text-[14px] leading-6 text-[#7a848c]"
          >
            A coding-agent stack split at its natural seam: a server that owns the workspace, a control plane for
            running it unattended, and thin clients that just render what the server says. Three parts, one
            protocol between all of them.
          </motion.p>
        </section>

        <section className="grid gap-5 py-12 md:grid-cols-3 md:py-16">
          {PRODUCT_LIST.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.06}>
              <a
                href={item.path}
                className="group flex h-full flex-col overflow-hidden border border-white/10 bg-white/[0.015] transition-colors duration-150 hover:border-white/20"
              >
                <div className="h-1" style={{ background: `linear-gradient(90deg, ${item.accent.from}, ${item.accent.to})` }} />
                <div className="flex flex-1 flex-col p-6">
                  <span
                    className="font-mono text-[11px] font-bold tracking-[0.06em] uppercase"
                    style={{ color: item.accent.solid }}
                  >
                    {statusLabel[item.status]}
                  </span>
                  <h2 className="mt-3 font-mono text-[19px] font-bold text-[#d5dde3]">{item.name}</h2>
                  <p className="mt-2 text-[13px] leading-6 text-[#7a848c]">{item.tagline}</p>

                  <ul className="mt-5 space-y-2 text-[12px] leading-5 text-[#7a848c]">
                    {detail[item.id].map((line) => (
                      <li key={line} className="flex gap-2">
                        <span style={{ color: item.accent.solid }}>·</span>
                        {line}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 border border-white/10 bg-[#0a0d10] p-3">
                    <p className="font-mono text-[10px] tracking-[0.08em] text-[#7a848c]/70 uppercase">
                      {preview[item.id].label}
                    </p>
                    <pre className="mt-2 font-mono text-[11px] leading-5 whitespace-pre-wrap text-[#d5dde3]">
                      {preview[item.id].lines.join("\n")}
                    </pre>
                  </div>

                  <span
                    className="mt-6 inline-flex items-center gap-1.5 font-mono text-[12px] text-[#d5dde3] group-hover:text-[#ff5c33]"
                  >
                    Open {item.shortName.toLowerCase()}
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </section>

        <section className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 py-8 font-mono text-[12px] text-[#7a848c]">
          <span className="uppercase tracking-[0.1em] text-[#7a848c]/70">an open-source resume project by</span>
          <a href={PERSONAL_LINKS.website} className="transition-colors hover:text-[#ff5c33]">
            {AUTHOR.name}
          </a>
          <a href={PERSONAL_LINKS.blog} className="transition-colors hover:text-[#ff5c33]">
            journal
          </a>
        </section>
      </main>

      <SiteFooter product={{ ...PRODUCT_LIST[0], github: MOTHER_REPO }} />
    </div>
  );
}
