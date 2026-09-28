"use client";

import { PRODUCTS, PRODUCT_LIST } from "@codeloom/config";
import { motion, useReducedMotion } from "motion/react";

import { SiteFooter } from "../chrome/footer";
import { SiteNav } from "../chrome/site-nav";
import { ProductShell } from "../components/product-shell";
import { Reveal } from "../magic/reveal";
import { ScreenshotPlaceholder } from "../mocks/screenshot-placeholder";

const product = PRODUCTS.clients;
const otherProducts = PRODUCT_LIST.filter((item) => item.id !== product.id);

const webClient = {
  label: "Web client",
  status: "in development",
  body: "A browser client for the CodeLoom cloud controller. Sign in with GitHub, register or pick a repository, start a session in an isolated sandbox, then watch the agent work live. It talks REST plus a WebSocket at /sessions/{id}/stream that carries the engine's JSON events and commands, relayed by the controller.",
  repo: "github.com/iresharma/codeloom.web",
  stack: "Next.js 15 · React 19 · Tailwind v4 · TypeScript",
  features: [
    "Streaming markdown transcript with collapsible tool-call cards and inline word-level diffs for edits.",
    "Multi-agent graph — orchestrator to child agents — with sub-agent cards showing tokens, cost and duration.",
    "Inspect panel: Agents, Changes (git staged / unstaged / untracked) and Files, plus a highlighted file viewer that switches to a diff.",
    "Status board with Working / Attention / Finished columns across all repos.",
    "Composer with Stop and a per-message model picker; permission cards (Allow / Deny / Always allow) and an Auto toggle.",
    "Live footer with branch, tokens, cached tokens, calls and cost; ended sessions keep a replayable transcript.",
  ],
  run: ["cp .env.example .env.local", "npm install", "npm run dev"],
};

// Screenshot slots for the web client. To use a real image, save it as
// apps/web/public/screenshots/<file> and set src: "/screenshots/<file>".
const webShots: { file: string; label: string; caption: string; src?: string }[] = [
  // web-board.png
  { file: "web-board.png", label: "status board", caption: "Status board — Working / Attention / Finished" },
  // web-agents.png
  { file: "web-agents.png", label: "agent graph", caption: "Agent graph — orchestrator and sub-agents" },
  // web-changes.png
  { file: "web-changes.png", label: "changes & files", caption: "Changes & files — git state and file tree" },
];

const otherClients = [
  {
    id: "tui",
    label: "TUI",
    status: "in development",
    body: "A terminal workspace: explorer, file viewer, and a persistent agent pane in one frame. Modal by default, mouse optional — built for people who already live in tmux.",
    repo: "github.com/iresharma/codeloom.TUI",
    // tui.png — set src: "/screenshots/tui.png" once the file exists.
    screenshot: { label: "tui workspace" } as { label: string; src?: string },
  },
];

export function ClientsLanding() {
  const reduce = useReducedMotion();

  return (
    <ProductShell product={product} className="bg-[#0c1014]">
      <SiteNav active="clients" />

      <main className="mx-auto max-w-5xl px-5 md:px-8 xl:max-w-6xl">
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

        <section className="border-b border-white/10 py-10">
          <p className="font-mono text-[12px] tracking-[0.15em] text-[#34d399] uppercase">Featured client</p>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="font-mono text-[15px] font-bold text-[#d5dde3]">{webClient.label}</h2>
            <span className="font-mono text-[11px] tracking-[0.06em] text-[#7a848c] uppercase">
              {webClient.status}
            </span>
          </div>
          <p className="mt-2 max-w-xl text-[13px] leading-6 text-[#7a848c]">{webClient.body}</p>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <a
              href={`https://${webClient.repo}`}
              target="_blank"
              rel="noreferrer"
              className="inline-block font-mono text-[12px] text-[#34d399] underline underline-offset-4"
            >
              {webClient.repo}
            </a>
            <span className="font-mono text-[11px] text-[#7a848c]/70">{webClient.stack}</span>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-[1fr_18rem]">
            <ul className="space-y-2 text-[12px] leading-5 text-[#7a848c]">
              {webClient.features.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-[#34d399]">·</span>
                  {line}
                </li>
              ))}
            </ul>
            <div className="h-fit border border-white/10 bg-[#0a0d10] p-3">
              <p className="font-mono text-[10px] tracking-[0.08em] text-[#7a848c]/70 uppercase">run it locally</p>
              <pre className="mt-2 font-mono text-[11px] leading-5 whitespace-pre-wrap text-[#d5dde3]">
                {webClient.run.map((cmd) => `$ ${cmd}`).join("\n")}
              </pre>
              <p className="mt-2 text-[11px] leading-5 text-[#7a848c]">
                NEXT_PUBLIC_API_URL defaults to http://localhost:8000; the controller's FRONTEND_ORIGIN must match
                http://localhost:3000.
              </p>
            </div>
          </div>

          <Reveal delay={0.05} className="mt-8">
            {/* web-session.png → src="/screenshots/web-session.png" */}
            <ScreenshotPlaceholder
              label="live session"
              caption="Live session — transcript, inline diffs, inspect panel"
            />
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              {webShots.map((shot) => (
                <ScreenshotPlaceholder key={shot.file} label={shot.label} caption={shot.caption} src={shot.src} />
              ))}
            </div>
          </Reveal>
        </section>

        <section className="border-b border-white/10 py-10">
          <p className="font-mono text-[12px] tracking-[0.15em] text-[#34d399] uppercase">More clients</p>
          <p className="mt-2 font-mono text-[15px] font-bold text-[#d5dde3]">Same events, other surfaces.</p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {otherClients.map((client, i) => (
              <Reveal key={client.id} delay={0.05 + i * 0.05}>
                <div className="flex h-full flex-col overflow-hidden border border-white/10 bg-white/[0.015] transition-colors duration-150 hover:border-white/20">
                  <div className="h-1" style={{ background: `linear-gradient(90deg, ${product.accent.from}, ${product.accent.to})` }} />
                  <div className="flex flex-1 flex-col p-6">
                    <span
                      className="font-mono text-[11px] font-bold tracking-[0.06em] uppercase"
                      style={{ color: product.accent.solid }}
                    >
                      {client.status}
                    </span>
                    <h3 className="mt-3 font-mono text-[19px] font-bold text-[#d5dde3]">{client.label}</h3>
                    <p className="mt-2 text-[13px] leading-6 text-[#7a848c]">{client.body}</p>
                    <a
                      href={`https://${client.repo}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block font-mono text-[12px] text-[#34d399] underline underline-offset-4"
                    >
                      {client.repo}
                    </a>
                    {/* tui.png → src="/screenshots/tui.png" */}
                    <ScreenshotPlaceholder
                      label={client.screenshot.label}
                      src={client.screenshot.src}
                      className="mt-6"
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="border-b border-white/10 py-10">
          <p className="font-mono text-[13px] font-bold text-[#d5dde3]">Clients render events; they don't call models.</p>
          <p className="mt-2 max-w-xl text-[13px] leading-6 text-[#7a848c]">
            No client talks to a model directly. The web client reaches the engine through the cloud controller,
            which relays the engine's JSON events and commands over a WebSocket; the TUI speaks the same protocol
            over the engine's local Unix socket. A new client is a rendering problem, not an agent-building one.
          </p>
        </section>

        <section className="flex flex-wrap items-center gap-x-6 gap-y-2 py-8 font-mono text-[12px] text-[#7a848c]">
          <span className="uppercase tracking-[0.1em] text-[#7a848c]/70">also from codeloom</span>
          {otherProducts.map((item) => (
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
