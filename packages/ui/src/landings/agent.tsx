"use client";

import { AUTHOR, PERSONAL_LINKS, PRODUCT_LIST, PRODUCTS } from "@codeloom/config";
import { ArrowUpRight, Github } from "lucide-react";
import { motion } from "motion/react";

import { AgentNav } from "../chrome/agent-nav";
import { GithubButtons } from "../components/github-buttons";
import { ProductShell } from "../components/product-shell";
import { BackgroundBeams } from "../fx/background-beams";
import { Lamp } from "../fx/lamp";
import { Spotlight } from "../fx/spotlight";
import { NumberTicker } from "../magic/number-ticker";
import { AgentMock } from "../mocks/agent-mock";

const product = PRODUCTS.agent;

const pipeline = [
  { n: "01", title: "Explore", body: "Walks the repo graph, finds the files that actually matter, ignores the noise." },
  { n: "02", title: "Patch", body: "Writes a focused diff. No drive-by refactors unless you asked for one." },
  { n: "03", title: "Test", body: "Runs the suite in a disposable sandbox. Your laptop is not the blast radius." },
  { n: "04", title: "PR", body: "The artifact is git. Review it like any other human-shaped contribution." },
];

const log = [
  {
    title: "It plans before it types",
    body: "A messy ticket becomes a sequence: files, tests, and a stop condition. If it cannot execute the plan, it says so.",
  },
  {
    title: "It lives in the repo",
    body: "Reads, searches, edits, and reruns until the suite is green — or it tells you why not. Long jobs survive a closed tab.",
  },
  {
    title: "You keep the merge button",
    body: "Nothing merges itself. Come back to a branch, a diff, and a conversation — not a half-typed chat.",
  },
];

const others = PRODUCT_LIST.filter((item) => item.id !== product.id);

export function AgentLanding() {
  return (
    <ProductShell product={product}>
      <AgentNav product={product} />
      <main>
        <section className="relative overflow-hidden">
          <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="#f5d0a0" />
          <BackgroundBeams />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-16 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pt-24">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/5 px-3 py-1 font-mono text-[11px] tracking-wide text-amber-200">
                <span className="size-1.5 rounded-full bg-amber-400" />
                Autonomous agent · coming soon · MIT
              </p>
              <h1 className="font-display mt-6 max-w-xl text-5xl leading-[0.95] font-semibold tracking-tight text-[#f5f0e8] sm:text-6xl lg:text-7xl">
                Give it a ticket.
                <span className="mt-2 block bg-gradient-to-r from-amber-300 via-orange-200 to-violet-300 bg-clip-text text-transparent">
                  Get a pull request.
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-zinc-400">
                CodeLoom is a Devin-shaped agent that explores the repo, plans, patches, runs tests, and opens a PR.
                Educational, open, and still very coming soon.
              </p>
              <GithubButtons product={product} className="mt-8" />
              <p className="mt-4 font-mono text-[11px] text-zinc-600">
                {product.host} · a dispatch by{" "}
                <a href={PERSONAL_LINKS.website} className="text-zinc-400 underline decoration-white/15 underline-offset-4">
                  {AUTHOR.name}
                </a>
              </p>
            </div>
            <AgentMock />
          </div>
        </section>

        <section className="relative border-y border-amber-200/10 bg-black/20">
          <div className="mx-auto grid max-w-7xl gap-0 md:grid-cols-4">
            {pipeline.map((stage, i) => (
              <div
                key={stage.title}
                className="relative border-white/5 px-6 py-10 md:border-r md:last:border-r-0"
              >
                {i < pipeline.length - 1 ? (
                  <span className="pointer-events-none absolute top-12 right-0 hidden h-px w-6 translate-x-1/2 bg-gradient-to-r from-amber-400/60 to-transparent md:block" />
                ) : null}
                <p className="font-mono text-[11px] text-amber-400/80">{stage.n}</p>
                <h2 className="font-display mt-3 text-2xl text-white">{stage.title}</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{stage.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:grid-cols-[0.7fr_1.3fr] md:px-8">
          <div className="md:sticky md:top-28 md:self-start">
            <p className="font-mono text-[11px] tracking-[0.25em] text-amber-400/80 uppercase">Mission log</p>
            <h2 className="font-display mt-3 text-4xl text-white">A short loop. Then a pull request.</h2>
            <p className="mt-4 text-zinc-400">
              No magic beyond a model, a sandbox, and the git primitives you already trust.
            </p>
          </div>
          <ol className="relative space-y-6 border-l border-amber-400/20 pl-8">
            {log.map((item, i) => (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: i * 0.08 }}
                className="relative"
              >
                <span className="absolute top-2 -left-[39px] size-3 rounded-full border border-amber-300 bg-[#07060b]" />
                <p className="font-mono text-[11px] text-zinc-500">T+{String((i + 1) * 12).padStart(2, "0")}m</p>
                <h3 className="mt-1 text-xl text-white">{item.title}</h3>
                <p className="mt-2 max-w-xl text-sm leading-7 text-zinc-400">{item.body}</p>
              </motion.li>
            ))}
          </ol>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-8 md:px-8">
          <div className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/5 md:grid-cols-3">
            {[
              { label: "Surfaces in the family", value: 5, suffix: "" },
              { label: "Closed-source lines", value: 0, suffix: "" },
              { label: "Merge buttons you still own", value: 100, suffix: "%" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#0c0a12] px-8 py-10">
                <p className="font-display text-5xl text-white">
                  <NumberTicker value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 font-mono text-[12px] text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <p className="font-mono text-[11px] tracking-[0.25em] text-zinc-500 uppercase">Adjacent consoles</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="group rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6"
              >
                <p className="font-mono text-[11px] text-zinc-500">{item.host}</p>
                <h3 className="mt-2 text-xl text-white">{item.name}</h3>
                <p className="mt-2 text-sm text-zinc-400">{item.tagline}</p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm text-amber-200">
                  Open {item.shortName}
                  <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-amber-200/10">
          <Lamp />
          <div className="relative mx-auto max-w-3xl px-5 py-28 text-center md:px-8">
            <p className="font-mono text-[11px] tracking-[0.3em] text-amber-300/80 uppercase">Coming soon</p>
            <h2 className="font-display mt-4 text-4xl text-white md:text-5xl">
              Star the repos. Watch the night shift.
            </h2>
            <p className="mt-4 text-zinc-400">
              Not for sale. An open-source resume project. Follow along on GitHub, or read the dispatch notes.
            </p>
            <div className="mt-8 flex justify-center">
              <GithubButtons product={product} />
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-8">
          <div>
            <p className="font-display text-2xl text-white">CodeLoom</p>
            <p className="mt-2 max-w-sm text-sm text-zinc-500">
              A family of open-source coding agents by {AUTHOR.name}. Resume projects, built in public.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 font-mono text-[12px] text-zinc-500">
            <a href={PERSONAL_LINKS.website} className="hover:text-white">
              {AUTHOR.websiteLabel}
            </a>
            <a href={PERSONAL_LINKS.blog} className="hover:text-white">
              blog
            </a>
            <a href={product.motherRepo} className="inline-flex items-center gap-1 hover:text-white">
              <Github className="size-3.5" />
              mother
            </a>
          </div>
        </div>
      </footer>
    </ProductShell>
  );
}
