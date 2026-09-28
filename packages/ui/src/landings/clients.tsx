"use client";

import { PRODUCTS, PRODUCT_LIST } from "@codeloom/config";
import { motion, useReducedMotion } from "motion/react";
import { SiteFooter } from "../chrome/footer";
import { SiteNav } from "../chrome/site-nav";
import { Reveal } from "../magic/reveal";
import { AgentMock } from "../mocks/agent-mock";
import { TuiMock } from "../mocks/tui-mock";
import { NewClientMock } from '../mocks/new-client-mock';

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
  {
    id: "new-client",
    label: "New Web Client",
    status: "concept",
    body: "This is a new web client offering advanced capabilities.",
    repo: null,
  },
];

export default function ClientPage() {
  const reduce = useReducedMotion();

  return (
    <div className="theme-engine min-h-screen bg-[#0c1014] text-[#d5dde3]">
      <SiteNav active="clients" />
      <main className="mx-auto max-w-5xl px-5 md:px-8">
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
      </main>
      <SiteFooter />
    </div>
  );
}
