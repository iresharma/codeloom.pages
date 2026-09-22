"use client";

import { PRODUCTS, PRODUCT_LIST } from "@codeloom/config";
import { motion, useReducedMotion } from "motion/react";

import { SiteFooter } from "../chrome/footer";
import { SiteNav } from "../chrome/site-nav";
import { ProductShell } from "../components/product-shell";
import { Reveal } from "../magic/reveal";
import { AgentMock } from "../mocks/agent-mock";
import { TuiMock } from "../mocks/tui-mock";

const product = PRODUCTS.clients;
const others = PRODUCT_LIST.filter((item) => item.id !== product.id);

const clients = [
  {
    id: "tui",
    label: "TUI",
    status: "in development",
    body: "A terminal workspace: explorer, file viewer, and a persistent agent pane in one frame. Modal by default, mouse optional — built for people who already live in tmux.",
    repo: "github.com/iresharma/codeloom.TUI",
  },
  {
    id: "web",
    label: "Web agent",
    status: "concept",
    body: "A Devin-style web interface — hand it a ticket, watch it explore, patch, and test in a sandbox, come back to a pull request. No terminal required.",
    repo: null,
  },
];

export function ClientsLanding() {
  const reduce = useReducedMotion();

  return (
    <ProductShell product={product} className="bg-[#0c1014]">
      <SiteNav active="clients" />

      <main className="mx-auto max-w-3xl px-5 md:px-8">
        <section className="border-b border-white/10 py-14 md:py-20">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-[12px] tracking-[0.15em] text-[#34d399] uppercase"
          >
            Every surface is a client
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            className="mt-2 font-mono text-2xl leading-snug font-bold text-[#d5dde3] sm:text-3xl"
          >
            The engine owns the workspace. These just render it.
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

        {clients.map((client, i) => (
          <section key={client.id} className="border-b border-white/10 py-10">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="font-mono text-[15px] font-bold text-[#d5dde3]">{client.label}</p>
              <span className="font-mono text-[11px] tracking-[0.06em] text-[#7a848c] uppercase">
                {client.status}
              </span>
            </div>
            <p className="mt-2 max-w-lg text-[13px] leading-6 text-[#7a848c]">{client.body}</p>
            {client.repo ? (
              <a
                href={`https://${client.repo}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block font-mono text-[12px] text-[#34d399] underline underline-offset-4"
              >
                {client.repo}
              </a>
            ) : null}
            <Reveal delay={0.05 + i * 0.05} className="mt-6">
              {client.id === "tui" ? <TuiMock /> : <AgentMock />}
            </Reveal>
          </section>
        ))}

        <section className="border-b border-white/10 py-10">
          <p className="font-mono text-[13px] font-bold text-[#d5dde3]">One protocol, not two integrations.</p>
          <p className="mt-2 max-w-xl text-[13px] leading-6 text-[#7a848c]">
            Neither client talks to a model directly. Both speak the same NDJSON commands and events over the
            engine's Unix socket — a new client is a rendering problem, not an agent-building one.
          </p>
        </section>

        <section className="flex flex-wrap items-center gap-x-6 gap-y-2 py-8 font-mono text-[12px] text-[#7a848c]">
          <span className="uppercase tracking-[0.1em] text-[#7a848c]/70">also from codeloom</span>
          {others.map((item) => (
            <a key={item.id} href={item.path} className="transition-colors hover:text-[#34d399]">
              {item.shortName.toLowerCase()}
            </a>
          ))}
        </section>
      </main>

      <SiteFooter product={product} />
    </ProductShell>
  );
}
