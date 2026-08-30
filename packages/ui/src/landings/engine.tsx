"use client";

import { type ReactNode } from "react";
import { AUTHOR, PERSONAL_LINKS, PRODUCT_LIST, PRODUCTS } from "@codeloom/config";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { EngineNav } from "../chrome/engine-nav";
import { GithubButtons } from "../components/github-buttons";
import { ProductShell } from "../components/product-shell";
import { GridPattern } from "../magic/grid-pattern";
import { NumberTicker } from "../magic/number-ticker";
import { EngineExtend } from "../mocks/engine-extend";
import { EngineFold } from "../mocks/engine-fold";
import { EngineMock } from "../mocks/engine-mock";

const product = PRODUCTS.engine;
const others = PRODUCT_LIST.filter((item) => item.id !== product.id);

const commands = [
  { name: "StartSession", meaning: "Bind a workspace. Pass session_id to resume from SQLite at .engine/session.db." },
  { name: "SubmitUserMessage", meaning: "One user turn. AgentLoop may run @tool calls and call the model again, capped at 8 turns." },
  { name: "RequestSnapshot", meaning: "Reconnect payload: messages, open files, rebuilt file tree, live git. Tree and git are not stored." },
  { name: "OpenFile / CloseFile", meaning: "Drive the file panel. Engine reads UTF-8 inside the workspace; the client never walks the repo." },
  { name: "RequestGit", meaning: "Branch, dirty, staged / unstaged / untracked, diffs. Rebuilt on request." },
  { name: "ListSessions", meaning: "Catalog of persisted sessions. Shutdown writes; the Unix server stays up." },
];

const loop = [
  {
    k: "01  bind",
    v: "python app.py . listens on {workspace}/.engine/engine.sock. One process owns the workspace. Clients never import the loop.",
  },
  {
    k: "02  command",
    v: "NDJSON in: StartSession, OpenFile, SubmitUserMessage, RequestGit. Typed dataclasses, language-agnostic. A TUI, a web UI, or dummy_client.py.",
  },
  {
    k: "03  event",
    v: "NDJSON out: SnapshotReady, FileContent, ChatMessageAdded, GitStateUpdated. Multiple clients subscribe to the same fan-out.",
  },
];

const designed = [
  "Orchestrator that does not patch files",
  "Named subagents: ask, linter, editor, reviewer",
  "ConversationCompressor — 30+ turns → 1–5",
  "LSP / tree-sitter / mutating git — still on the bench",
];

const lanes = [
  {
    id: "fast",
    label: "Fast lane",
    sub: "tools · for the model",
    body: "AgentLoop runs @tool calls in a loop, capped at 8 turns. If a tool is wrong, the blast radius is one session — so shipping one is cheap: drop a module under tools/, decorate the function, restart. The loop imports the package tree and finds it. Nothing to register, nothing else to touch.",
  },
  {
    id: "slow",
    label: "Slow lane",
    sub: "commands & events · for the client",
    body: "A TUI in Python and a pane in TypeScript both read the same JSON type name off the wire, so this path stays slow on purpose. Land it in protocol/commands.py or protocol/events.py; @command / @event / @handles keep it in one reviewable place before anything ships.",
  },
] as const;

const extendStats = [
  { label: "decorator away", value: 1, suffix: "", hint: "@tool — drop the file, restart" },
  { label: "files own the wire", value: 2, suffix: "", hint: "commands.py + events.py" },
  { label: "registries a tool touches", value: 0, suffix: "", hint: "the loop just imports the package tree" },
];

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function EngineLanding() {
  const reduce = useReducedMotion();

  return (
    <ProductShell product={product} className="relative bg-[#0c1014]">
      <GridPattern
        width={48}
        height={48}
        className="fill-[#ff5c33]/[0.03] stroke-[#ff5c33]/10 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"
      />
      <EngineNav product={product} />

      <main className="relative z-10">
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-12 md:px-8 md:py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 border border-[#ff5c33]/40 bg-[#ff5c33]/10 px-3 py-1 font-mono text-[11px] tracking-[0.18em] text-[#ff5c33] uppercase"
            >
              Python · json-ipc · incomplete · MIT
            </motion.p>
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-mono text-4xl leading-[0.95] font-semibold tracking-tight text-[#ece8e1] sm:text-5xl lg:text-6xl"
            >
              The agent is a client.
              <span className="mt-2 block text-[#ff5c33]">This is the server.</span>
            </motion.h1>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.5 }}
              className="mt-6 max-w-xl text-[17px] leading-8 text-[#b7c9d4]"
            >
              CodeLoom Engine is a Python JSON-IPC core for a coding-agent workplace. It owns the workspace. A TUI, an
              IDE pane, or a REPL connects to{" "}
              <span className="font-mono text-[14px] text-[#ff5c33]">.engine/engine.sock</span> and speaks
              newline-delimited commands and events. Clients never import the loop.
            </motion.p>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.5 }}
              className="mt-4 max-w-xl text-[15px] leading-7 text-[#8ab4c8]"
            >
              Shipping today: SQLite sessions, OpenRouter, sandboxed reads, git status, drop-in{" "}
              <span className="font-mono text-[13px] text-[#ece8e1]">@tool</span> files, and a cataloged command/event
              wire. Designed, not built: orchestrator, named subagents, context folding. Still early.
            </motion.p>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.45 }}
            >
              <GithubButtons product={product} tone="engine" className="mt-8" />
              <p className="mt-4 font-mono text-[11px] text-[#8ab4c8]/70">
                {product.host} · {product.github.replace("https://", "")} · {AUTHOR.name}
              </p>
            </motion.div>
          </div>
          <EngineMock />
        </section>

        <section className="border-y border-[#ff5c33]/20 bg-[#080b0e]">
          <div className="mx-auto grid max-w-6xl md:grid-cols-3">
            {loop.map((step, i) => (
              <Reveal
                key={step.k}
                delay={i * 0.08}
                className="group border-[#ff5c33]/20 px-6 py-10 transition-colors duration-300 hover:bg-[#ff5c33]/5 md:border-r md:last:border-r-0"
              >
                <p className="font-mono text-[11px] tracking-[0.2em] text-[#ff5c33] uppercase">{step.k}</p>
                <p className="mt-3 text-[15px] leading-7 text-[#b7c9d4]">{step.v}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 md:px-8">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.25em] text-[#8ab4c8] uppercase">Protocol</p>
            <h2 className="mt-3 font-mono text-3xl text-[#ece8e1] md:text-4xl">Commands in. Events out.</h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#8ab4c8]">
              Commands live in <span className="font-mono text-[#ece8e1]">protocol/commands.py</span>, events in{" "}
              <span className="font-mono text-[#ece8e1]">protocol/events.py</span>.{" "}
              <span className="font-mono text-[#ece8e1]">@command</span> /{" "}
              <span className="font-mono text-[#ece8e1]">@event</span> fill the registries;{" "}
              <span className="font-mono text-[#ece8e1]">@handles</span> lands on EngineSession. A TUI in any language
              has to know the JSON <span className="font-mono text-[#ece8e1]">type</span> names, so they stay in those
              two files. The client renders. It does not walk the tree.
            </p>
          </Reveal>
          <div className="mt-8 divide-y divide-[#ff5c33]/15 border-y border-[#ff5c33]/15">
            {commands.map((item, i) => (
              <Reveal key={item.name} delay={i * 0.04}>
                <div className="group relative grid gap-2 py-5 transition-colors duration-200 hover:bg-[#ff5c33]/[0.04] sm:grid-cols-[13rem_1fr] md:grid-cols-[16rem_1fr]">
                  <span className="absolute inset-y-0 left-0 w-0 bg-[#ff5c33] transition-all duration-200 group-hover:w-0.5" />
                  <p className="pl-3 font-mono text-[13px] text-[#ff5c33]">{item.name}</p>
                  <p className="text-[15px] leading-7 text-[#d5dde3]">{item.meaning}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="border-y border-[#ff5c33]/20 bg-[#080b0e]">
          <div className="mx-auto max-w-6xl px-4 py-20 md:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <Reveal>
                <p className="font-mono text-[11px] tracking-[0.25em] text-[#8ab4c8] uppercase">Design</p>
                <h2 className="mt-3 font-mono text-3xl leading-tight text-[#ece8e1] md:text-4xl">
                  Two audiences. Two extension paths.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="max-w-xl text-[15px] leading-7 text-[#b7c9d4]">
                  Engine owns the workspace; the client only renders it. That boundary is why capability had to fork
                  into two paths, not one. A tool is a bet the model takes alone, inside a single turn — cheap to
                  add, cheap to be wrong. A command or event is a promise every client depends on, in whatever
                  language it&apos;s written in — expensive to get wrong, so it stays reviewable. Tools grow by
                  convention. The wire grows by agreement.
                </p>
              </Reveal>
            </div>

            <div className="mt-10 grid gap-px overflow-hidden border border-[#ff5c33]/25 bg-[#ff5c33]/15 md:grid-cols-2">
              {lanes.map((lane, i) => (
                <Reveal
                  key={lane.id}
                  delay={i * 0.08}
                  className="bg-[#080b0e] px-6 py-8 transition-colors duration-300 hover:bg-[#10161c]"
                >
                  <p className="font-mono text-[11px] tracking-[0.2em] text-[#f2c14e] uppercase">{lane.sub}</p>
                  <h3 className="mt-2 font-mono text-xl text-[#ece8e1]">{lane.label}</h3>
                  <p className="mt-3 text-[14px] leading-7 text-[#b7c9d4]">{lane.body}</p>
                </Reveal>
              ))}
            </div>

            <div className="mt-px grid gap-px overflow-hidden border border-t-0 border-[#ff5c33]/25 bg-[#ff5c33]/15 sm:grid-cols-3">
              {extendStats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#080b0e] px-6 py-7 transition-colors duration-300 hover:bg-[#10161c]"
                >
                  <p className="font-mono text-4xl text-[#ff5c33]">
                    <NumberTicker value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-2 font-mono text-[12px] text-[#ece8e1]">{stat.label}</p>
                  <p className="mt-1 text-[13px] text-[#8ab4c8]">{stat.hint}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 md:px-8">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.25em] text-[#8ab4c8] uppercase">Extend</p>
            <h2 className="mt-3 font-mono text-3xl text-[#ece8e1] md:text-4xl">The same rule, in code.</h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#b7c9d4]">
              One decorator for the fast lane, two catalog files for the slow one. If the agent should read git, add
              a tool. If the UI should show git without asking the LLM, add a command and an event. This is what
              each looks like from inside the source.
            </p>
          </Reveal>
          <div className="mt-8">
            <EngineExtend />
          </div>
        </section>

        <section className="border-y border-[#ff5c33]/20 bg-[#0c1014]">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <Reveal>
                <p className="font-mono text-[11px] tracking-[0.25em] text-[#f2c14e] uppercase">
                  Designed · not implemented
                </p>
                <h2 className="mt-3 font-mono text-3xl leading-tight text-[#ece8e1] md:text-4xl">
                  An orchestrator that does not act. Workers that fold.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="max-w-xl text-[15px] leading-7 text-[#b7c9d4]">
                  The bet the protocol is built for: a main agent that never writes the patch. It spawns named
                  subagents — ask, linter, editor, reviewer — then a ConversationCompressor folds each trail from 30+
                  messages (thinking, tool calls, the mess) into 1–5. AgentLoop today already runs{" "}
                  <span className="font-mono text-[13px] text-[#ece8e1]">@tool</span> calls in a loop (capped at 8
                  turns). The orch and the compressor are still ahead.
                </p>
              </Reveal>
            </div>

            <div className="mt-10 grid gap-px overflow-hidden border border-[#ff5c33]/25 bg-[#ff5c33]/15 sm:grid-cols-3">
              {[
                { label: "Raw worker trail", value: 30, suffix: "+", hint: "the compressor target" },
                { label: "After a fold", value: 3, suffix: "", hint: "typically 1–5 messages" },
                { label: "Work the orch should do", value: 0, suffix: "", hint: "spawn, read, write_context" },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#0c1014] px-6 py-8 transition-colors duration-300 hover:bg-[#141a20]">
                  <p className="font-mono text-5xl text-[#ff5c33]">
                    <NumberTicker value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-2 font-mono text-[12px] text-[#ece8e1]">{stat.label}</p>
                  <p className="mt-1 text-[13px] text-[#8ab4c8]">{stat.hint}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {designed.map((item) => (
                <span
                  key={item}
                  className="border border-[#f2c14e]/25 bg-[#f2c14e]/5 px-3 py-1.5 font-mono text-[11px] text-[#f2c14e]"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-10">
              <EngineFold />
              <p className="mt-3 font-mono text-[11px] text-[#8ab4c8]/70">
                Click <span className="text-[#f2c14e]">fold</span> to replay the compressor. This is the roadmap, not a
                live trace.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 md:px-8">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.25em] text-[#8ab4c8] uppercase">Clients</p>
            <h2 className="mt-3 font-mono text-3xl text-[#ece8e1]">You build the skin. Engine does the workplace.</h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#b7c9d4]">
              Point dummy_client.py, a TUI, or something weirder at the socket. Sessions persist. File tree and git are
              rebuilt on snapshot so the client stays a renderer. New UI verbs go in the command catalog — the dummy
              client already looks up type names. New model verbs go under tools/. Don&apos;t fork the loop.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <pre className="mt-8 overflow-x-auto border border-[#ff5c33]/25 bg-[#080b0e] p-5 font-mono text-[12px] leading-7 text-[#d5dde3] transition-colors duration-300 hover:border-[#ff5c33]/50 sm:text-[13px]">
{`python app.py .
# listening on .engine/engine.sock

python dummy_client.py .
engine> start
engine> open src/auth.ts
engine> fix the flaky auth test
{"type":"ChatMessageAdded","role":"assistant",...}
engine> git
{"type":"GitStateUpdated","git":{"branch":"main","dirty":true}}`}
            </pre>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="mt-8 border border-[#f2c14e]/30 bg-[#f2c14e]/8 p-5">
              <p className="font-mono text-[12px] tracking-[0.18em] text-[#f2c14e] uppercase">Status</p>
              <p className="mt-2 text-[15px] leading-7 text-[#ece8e1]">
                Still in development. Missing a lot — orchestrator, named subagents, compressor, LSP, tree-sitter,
                mutating git. What you can clone today: the socket, the two catalogs,{" "}
                <span className="font-mono text-[13px]">@tool</span> discovery, SQLite sessions, reads, git status, and
                an OpenRouter loop that will actually run the tools the model calls.
              </p>
              <GithubButtons product={product} tone="engine" className="mt-5" />
            </div>
          </Reveal>
        </section>

        <section className="border-t border-[#ff5c33]/20 bg-[#080b0e] px-4 py-16 md:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="font-mono text-[11px] tracking-[0.25em] text-[#8ab4c8] uppercase">Adjacent surfaces</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {others.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  whileHover={reduce ? undefined : { y: -3 }}
                  className="group border border-white/8 bg-[#0c1014] p-5 transition-colors duration-200 hover:border-[#ff5c33]/50 hover:bg-[#ff5c33]/5"
                >
                  <p className="font-mono text-[11px] text-[#8ab4c8]">{item.host}</p>
                  <h3 className="mt-2 font-mono text-lg text-[#ece8e1]">{item.name}</h3>
                  <p className="mt-2 text-[13px] leading-6 text-[#8ab4c8]">{item.tagline}</p>
                  <span className="mt-4 inline-flex items-center gap-1 font-mono text-[12px] text-[#ff5c33]">
                    Open {item.shortName}
                    <ArrowUpRight className="size-3.5 transition duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-[#ff5c33]/25 bg-[#080b0e]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 font-mono text-[11px] text-[#8ab4c8] md:flex-row md:items-center md:justify-between md:px-8">
          <p>
            .engine/engine.sock &nbsp; {new Date().getFullYear()} &nbsp; {AUTHOR.name} &nbsp; MIT
          </p>
          <div className="flex flex-wrap gap-4">
            <a href={PERSONAL_LINKS.website} className="transition-colors hover:text-[#ff5c33]">
              {AUTHOR.websiteLabel}
            </a>
            <a href={PERSONAL_LINKS.blog} className="transition-colors hover:text-[#ff5c33]">
              journal
            </a>
            <a href={product.github} className="transition-colors hover:text-[#ff5c33]">
              engine repo
            </a>
            <span className="text-[#ff5c33]">LISTEN unix</span>
          </div>
        </div>
      </footer>
    </ProductShell>
  );
}
