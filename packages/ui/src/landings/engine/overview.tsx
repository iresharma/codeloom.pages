"use client";

import { PRODUCT_LIST, PRODUCTS } from "@codeloom/config";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { EngineChapterNav, EngineFooter } from "../../chrome/engine-footer";
import { EngineNav } from "../../chrome/engine-nav";
import { EngineSubNav } from "../../chrome/engine-subnav";
import { ProductShell } from "../../components/product-shell";
import { Reveal } from "../../magic/reveal";

const product = PRODUCTS.engine;
const others = PRODUCT_LIST.filter((item) => item.id !== product.id);

const chapters = [
  { n: "01", label: "read funnel", href: "/read-funnel", body: "The cheapest tool that answers, every time." },
  { n: "02", label: "write funnel", href: "/write-funnel", body: "Six checks before any write lands." },
  { n: "03", label: "agents", href: "/agents", body: "An orchestrator that spawns, isolates, and folds." },
  { n: "04", label: "extend", href: "/extend", body: "Every surface is a file and a restart." },
];

const faqs = [
  {
    q: "What is CodeLoom Engine?",
    a: "A Python process that owns a workspace and speaks NDJSON over a Unix socket. It runs the model loop, the tools, and the write funnel. Clients — a TUI, a web app, anything — just render what it says.",
  },
  {
    q: "Is it open source?",
    a: "Source-available. Free to clone, read, and run for development and evaluation. Production use needs a commercial license — see the Business Source License in the repo.",
  },
  {
    q: "What can it actually do today?",
    a: "32 tools across ten families, a syntax-gated write funnel with full undo, an orchestrator that spawns six subagent personas into isolated git worktrees, tree-sitter and real language servers for four languages, SQLite sessions, and an OpenRouter loop. None of that is the ceiling — see the next question.",
  },
  {
    q: "Is 32 tools and 6 agents all I get?",
    a: "No — that's just what ships. There's no registry to edit and no client to rebuild: drop a file, decorate it, restart the session. Every surface — tools, commands, subagents, transport, model — extends the same way. See extend.",
    code: `@tool(description="Count lines in a file.")
def count_lines(ctx, path: str) -> str:
    return str(len(read(path).splitlines()))`,
  },
  {
    q: "What's still limited?",
    a: "Deep tooling — tree-sitter, LSP, the syntax gate — covers Python, Go, JavaScript, and TypeScript. Fourteen more languages are detected but not syntax-gated. Browser tools need Playwright installed.",
  },
];

export function EngineOverviewLanding() {
  const reduce = useReducedMotion();

  return (
    <ProductShell product={product} className="bg-[#0c1014]">
      <EngineNav product={product} />
      <EngineSubNav active="overview" />

      <main className="mx-auto max-w-3xl px-5 md:px-8">
        <section className="border-b border-white/10 py-14 md:py-20">
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="font-mono text-2xl leading-snug font-bold text-[#d5dde3] sm:text-3xl"
          >
            The agent is a client. This is the server.
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.4 }}
            className="mt-4 max-w-xl text-[14px] leading-6 text-[#7a848c]"
          >
            A Python core that owns the workspace. A TUI, an IDE, a REPL — every client speaks the same
            newline-delimited protocol over one socket.
          </motion.p>

          <motion.pre
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.4 }}
            className="mt-8 overflow-x-auto border border-white/10 bg-[#0a0d10] p-4 font-mono text-[13px] leading-6 text-[#d5dde3]"
          >
{`$ python app.py .
listening on .engine/engine.sock

$ python dummy_client.py .
engine> fix the flaky auth test`}
          </motion.pre>

          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mt-6 text-[13px] leading-6 text-[#7a848c]"
          >
            [*] Ships with <strong className="text-[#d5dde3]">32 tools</strong> and{" "}
            <strong className="text-[#d5dde3]">6 subagent personas</strong> — not a ceiling. Every one is a single
            file. Add your own the same way.
          </motion.p>
        </section>

        <section className="divide-y divide-white/10 border-b border-white/10">
          {chapters.map((chapter, i) => (
            <Reveal key={chapter.href} delay={i * 0.04}>
              <a href={chapter.href} className="group flex items-baseline justify-between gap-4 py-4">
                <span className="font-mono text-[14px] text-[#d5dde3] group-hover:text-[#ff5c33]">
                  <span className="text-[#7a848c]">{chapter.n}</span> {chapter.label}
                </span>
                <span className="hidden text-[13px] text-[#7a848c] sm:block">{chapter.body}</span>
                <ArrowRight className="size-3.5 shrink-0 text-[#7a848c] transition-transform group-hover:translate-x-1 group-hover:text-[#ff5c33]" />
              </a>
            </Reveal>
          ))}
        </section>

        <section className="border-b border-white/10 py-10">
          <p className="font-mono text-[12px] tracking-[0.15em] text-[#7a848c] uppercase">FAQ</p>
          <div className="mt-4 divide-y divide-white/10">
            {faqs.map((item) => (
              <details key={item.q} className="group py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-mono text-[14px] text-[#d5dde3]">
                  {item.q}
                  <span className="text-[#7a848c] group-open:hidden">+</span>
                  <span className="hidden text-[#7a848c] group-open:inline">−</span>
                </summary>
                <p className="mt-2 max-w-xl text-[13px] leading-6 text-[#7a848c]">{item.a}</p>
                {"code" in item && item.code ? (
                  <pre className="mt-3 max-w-xl overflow-x-auto border border-white/10 bg-[#0a0d10] p-3 font-mono text-[12px] leading-6 text-[#d5dde3]">
                    {item.code}
                  </pre>
                ) : null}
              </details>
            ))}
          </div>
        </section>

        <section className="flex flex-wrap items-center gap-x-6 gap-y-2 py-8 font-mono text-[12px] text-[#7a848c]">
          <span className="uppercase tracking-[0.1em] text-[#7a848c]/70">also from codeloom</span>
          {others.map((item) => (
            <a key={item.id} href={item.href} className="transition-colors hover:text-[#ff5c33]">
              {item.shortName.toLowerCase()}
            </a>
          ))}
        </section>
      </main>

      <EngineChapterNav active="overview" />
      <EngineFooter product={product} />
    </ProductShell>
  );
}
