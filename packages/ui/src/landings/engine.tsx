"use client";

import { AUTHOR, PERSONAL_LINKS, PRODUCT_LIST, PRODUCTS } from "@codeloom/config";
import { ArrowUpRight } from "lucide-react";

import { EngineNav } from "../chrome/engine-nav";
import { GithubButtons } from "../components/github-buttons";
import { ProductShell } from "../components/product-shell";
import { GridPattern } from "../magic/grid-pattern";
import { NumberTicker } from "../magic/number-ticker";
import { EngineFold } from "../mocks/engine-fold";
import { EngineMock } from "../mocks/engine-mock";

const product = PRODUCTS.engine;
const others = PRODUCT_LIST.filter((item) => item.id !== product.id);

const exportsApi = [
  { name: "session.*", meaning: "Open, resume, and stream a local agent session. The client never owns the transcript." },
  { name: "llm.wrap", meaning: "OpenRouter wrapper. One socket call, not a pile of provider SDKs in your UI." },
  { name: "fs / FileOps", meaning: "Read, write, patch. The handlers the model actually uses, not a toy FS." },
  { name: "git.*", meaning: "Status, diff, commit-shaped work. Git stays on the machine, not in the chat." },
  { name: "dir.*", meaning: "Walk the workspace. Index what matters so the client can stay thin." },
  { name: "tools.*", meaning: "Base tool implementations the LLM can call. Extend them; don't re-derive them." },
  { name: "models / api", meaning: "Typed surfaces to build on. Engine is the backend; your TUI, IDE, or CLI is the skin." },
];

const loop = [
  {
    k: "01  listen",
    v: "A local Unix server speaks NDJSON. Your client connects. No cloud round-trip for the workplace itself.",
  },
  {
    k: "02  orchestrate",
    v: "The main agent does not patch files. It spawns workers, each with a job and a bounded context.",
  },
  {
    k: "03  fold",
    v: "When a worker finishes, thinking and tool noise collapse into 1–5 messages. The orchestrator keeps the signal.",
  },
];

export function EngineLanding() {
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
            <p className="inline-flex items-center gap-2 border border-[#ff5c33]/40 bg-[#ff5c33]/10 px-3 py-1 font-mono text-[11px] tracking-[0.18em] text-[#ff5c33] uppercase">
              In development · incomplete · MIT
            </p>
            <h1 className="mt-6 font-mono text-4xl leading-[0.95] font-semibold tracking-tight text-[#ece8e1] sm:text-5xl lg:text-6xl">
              The agent is a client.
              <span className="mt-2 block text-[#ff5c33]">This is the server.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-8 text-[#b7c9d4]">
              CodeLoom Engine is a drop-in backend for a coding-agent workplace: an NDJSON Unix socket that manages
              sessions, wraps the LLM through OpenRouter, and does FileOps, Git, directory, and tool heavy lifting so
              the UI you build can stay a client.
            </p>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#8ab4c8]">
              Highly extendable — APIs and models to build on top of. Also honest: this is still in development, and a
              lot of features are missing.
            </p>
            <GithubButtons product={product} tone="engine" className="mt-8" />
            <p className="mt-4 font-mono text-[11px] text-[#8ab4c8]/70">
              {product.host} · unix socket · ndjson · {AUTHOR.name}
            </p>
          </div>
          <EngineMock />
        </section>

        <section className="border-y border-[#ff5c33]/20 bg-[#080b0e]">
          <div className="mx-auto grid max-w-6xl md:grid-cols-3">
            {loop.map((step) => (
              <div key={step.k} className="border-[#ff5c33]/20 px-6 py-10 md:border-r md:last:border-r-0">
                <p className="font-mono text-[11px] tracking-[0.2em] text-[#ff5c33] uppercase">{step.k}</p>
                <p className="mt-3 text-[15px] leading-7 text-[#b7c9d4]">{step.v}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 md:px-8">
          <p className="font-mono text-[11px] tracking-[0.25em] text-[#8ab4c8] uppercase">Exports</p>
          <h2 className="mt-3 font-mono text-3xl text-[#ece8e1] md:text-4xl">What the socket already carries</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#8ab4c8]">
            Engine is the workplace backend. Session state, the model call, the filesystem, git, and the tools live
            here — not reimplemented in every client.
          </p>
          <dl className="mt-8 divide-y divide-[#ff5c33]/15 border-y border-[#ff5c33]/15">
            {exportsApi.map((item) => (
              <div key={item.name} className="grid gap-2 py-5 sm:grid-cols-[11rem_1fr] md:grid-cols-[14rem_1fr]">
                <dt className="font-mono text-[13px] text-[#ff5c33]">{item.name}</dt>
                <dd className="text-[15px] leading-7 text-[#d5dde3]">{item.meaning}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="border-y border-[#ff5c33]/20 bg-[#080b0e]">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <div>
                <p className="font-mono text-[11px] tracking-[0.25em] text-[#f2c14e] uppercase">
                  The point of the architecture
                </p>
                <h2 className="mt-3 font-mono text-3xl leading-tight text-[#ece8e1] md:text-4xl">
                  An orchestrator that does not act. Workers that fold.
                </h2>
              </div>
              <p className="max-w-xl text-[15px] leading-7 text-[#b7c9d4]">
                The main agent never writes the patch. It spawns subagents with a job. Each worker burns context —
                thinking, tool calls, the whole trail — then Engine compresses that trail into 1–5 messages instead of
                30+. The bluff is dropped. The orchestrator keeps a usable window.
              </p>
            </div>

            <div className="mt-10 grid gap-px overflow-hidden border border-[#ff5c33]/25 bg-[#ff5c33]/15 sm:grid-cols-3">
              {[
                { label: "Raw worker trail", value: 30, suffix: "+", hint: "thinking + tools + chatter" },
                { label: "After a fold", value: 3, suffix: "", hint: "typically 1–5 messages" },
                { label: "Work the orchestrator does", value: 0, suffix: "", hint: "it only spawns and reads" },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#0c1014] px-6 py-8">
                  <p className="font-mono text-5xl text-[#ff5c33]">
                    <NumberTicker value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-2 font-mono text-[12px] text-[#ece8e1]">{stat.label}</p>
                  <p className="mt-1 text-[13px] text-[#8ab4c8]">{stat.hint}</p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <EngineFold />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 md:px-8">
          <p className="font-mono text-[11px] tracking-[0.25em] text-[#8ab4c8] uppercase">Clients</p>
          <h2 className="mt-3 font-mono text-3xl text-[#ece8e1]">You build the skin. Engine does the workplace.</h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#b7c9d4]">
            Point a TUI, IDE pane, CLI, or something weirder at the socket. Sessions, tools, and the model wrapper are
            already on the other side. Extend the API; don't fork the loop.
          </p>
          <pre className="mt-8 overflow-x-auto border border-[#ff5c33]/25 bg-[#080b0e] p-5 font-mono text-[12px] leading-7 text-[#d5dde3] sm:text-[13px]">
{`# local unix · ndjson
socat - UNIX-CONNECT:/tmp/codeloom.sock

{"t":"session.open","cwd":"/work/api"}
{"t":"agent.run","prompt":"fix the flaky auth test"}
{"t":"fold","worker":"w_12","from":34,"to":3}`}
          </pre>
          <div className="mt-8 border border-[#f2c14e]/30 bg-[#f2c14e]/8 p-5">
            <p className="font-mono text-[12px] tracking-[0.18em] text-[#f2c14e] uppercase">Status</p>
            <p className="mt-2 text-[15px] leading-7 text-[#ece8e1]">
              Still in development. Missing a lot of features. The architecture above is the bet — not a finished
              product. Star the repo if you want to watch the socket grow.
            </p>
            <GithubButtons product={product} tone="engine" className="mt-5" />
          </div>
        </section>

        <section className="border-t border-[#ff5c33]/20 bg-[#080b0e] px-4 py-16 md:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="font-mono text-[11px] tracking-[0.25em] text-[#8ab4c8] uppercase">Adjacent surfaces</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {others.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="group border border-white/8 bg-[#0c1014] p-5 hover:border-[#ff5c33]/40"
                >
                  <p className="font-mono text-[11px] text-[#8ab4c8]">{item.host}</p>
                  <h3 className="mt-2 font-mono text-lg text-[#ece8e1]">{item.name}</h3>
                  <p className="mt-2 text-[13px] leading-6 text-[#8ab4c8]">{item.tagline}</p>
                  <span className="mt-4 inline-flex items-center gap-1 font-mono text-[12px] text-[#ff5c33]">
                    Open {item.shortName}
                    <ArrowUpRight className="size-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-[#ff5c33]/25 bg-[#080b0e]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 font-mono text-[11px] text-[#8ab4c8] md:flex-row md:items-center md:justify-between md:px-8">
          <p>
            codeloom-engine.service &nbsp; {new Date().getFullYear()} &nbsp; {AUTHOR.name} &nbsp; MIT
          </p>
          <div className="flex flex-wrap gap-4">
            <a href={PERSONAL_LINKS.website} className="hover:text-[#ff5c33]">
              {AUTHOR.websiteLabel}
            </a>
            <a href={PERSONAL_LINKS.blog} className="hover:text-[#ff5c33]">
              journal
            </a>
            <a href={product.motherRepo} className="hover:text-[#ff5c33]">
              mother
            </a>
            <span className="text-[#ff5c33]">LISTEN unix</span>
          </div>
        </div>
      </footer>
    </ProductShell>
  );
}
