"use client";

import { useState } from "react";
import { AUTHOR, PERSONAL_LINKS, PRODUCT_LIST, PRODUCTS } from "@codeloom/config";
import { Braces, MessageSquare, Sparkles, SplitSquareHorizontal } from "lucide-react";

import { IdeNav } from "../chrome/ide-nav";
import { GithubButtons } from "../components/github-buttons";
import { ProductShell } from "../components/product-shell";
import { Dots } from "../fx/dots";
import { IdeMock } from "../mocks/ide-mock";
import { cn } from "../lib/utils";

const product = PRODUCTS.ide;

const tabs = [
  {
    id: "tab",
    Icon: Sparkles,
    label: "Inline",
    title: "Ghost text that knows the next file",
    body: "Completions that live in the buffer. Tab when you are in flow. The model already has the file you are in — and the one beside it.",
  },
  {
    id: "composer",
    Icon: SplitSquareHorizontal,
    label: "Composer",
    title: "Describe a change across the workspace",
    body: "A multi-file diff streams in like a human patch. Tab, Agent, Ask, Edit — pick a mode, keep the tree in view.",
  },
  {
    id: "chat",
    Icon: MessageSquare,
    label: "Chat",
    title: "Talk to the tree, not the vibes",
    body: "The sidebar indexes the repo so questions hit real symbols. Citations, apply, undo. Same muscle memory as VS Code.",
  },
  {
    id: "bones",
    Icon: Braces,
    label: "Fork",
    title: "Familiar bones",
    body: "Forked from VS Code. Keybindings, extensions, and the status bar stay. The AI is a pane, not a new religion.",
  },
];

const others = PRODUCT_LIST.filter((item) => item.id !== product.id);

export function IdeLanding() {
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((tab) => tab.id === active) ?? tabs[0];

  return (
    <ProductShell product={product} className="bg-[#1e1e1e]">
      <IdeNav product={product} />
      <main>
        <section className="relative overflow-hidden border-b border-black/40">
          <Dots className="opacity-40" />
          <div className="relative mx-auto grid max-w-[1400px] items-stretch lg:grid-cols-[minmax(280px,420px)_1fr]">
            <div className="border-b border-black/40 bg-[#252526] px-6 py-10 lg:border-r lg:border-b-0 lg:py-16">
              <p className="text-[11px] tracking-[0.2em] text-violet-300 uppercase">VS Code fork · coming soon</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                An editor that talks back.
              </h1>
              <p className="mt-4 text-[15px] leading-7 text-[#b5b5b5]">{product.description}</p>
              <GithubButtons product={product} tone="ide" className="mt-6" />
              <div className="mt-8 space-y-2 font-mono text-[12px] text-[#808080]">
                <p>⌘K  composer</p>
                <p>⌘I  inline</p>
                <p>⌘L  chat with selection</p>
              </div>
            </div>
            <div className="bg-[#1e1e1e] px-4 py-8 lg:px-8 lg:py-10">
              <IdeMock className="max-w-none" />
            </div>
          </div>
        </section>

        <section className="border-b border-black/40 bg-[#181818]">
          <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-8">
            <div className="overflow-hidden rounded-md border border-black/50 bg-[#1e1e1e] shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]">
              <div className="flex flex-wrap border-b border-black/40 bg-[#2d2d2d]">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActive(tab.id)}
                    className={cn(
                      "flex items-center gap-2 border-r border-black/30 px-4 py-2 text-[13px]",
                      active === tab.id ? "bg-[#1e1e1e] text-white" : "text-[#9d9d9d] hover:text-white",
                    )}
                  >
                    <tab.Icon className="size-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="grid gap-8 p-6 md:grid-cols-[1fr_280px] md:p-10">
                <div>
                  <p className="font-mono text-[11px] text-violet-300">editor/{current.id}.ts</p>
                  <h2 className="mt-2 text-3xl font-semibold text-white">{current.title}</h2>
                  <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#b5b5b5]">{current.body}</p>
                </div>
                <aside className="rounded border border-white/5 bg-[#252526] p-4 font-mono text-[12px] text-[#9d9d9d]">
                  <p className="text-[10px] tracking-widest text-[#6a6a6a] uppercase">Problems</p>
                  <p className="mt-3 text-emerald-400">0 errors</p>
                  <p className="mt-1">2 agent suggestions</p>
                  <p className="mt-1">1 uncommitted composer diff</p>
                </aside>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-black/40 bg-[#1e1e1e] px-4 py-16 md:px-8">
          <div className="mx-auto max-w-[1400px]">
            <p className="text-[11px] tracking-[0.2em] text-[#6a6a6a] uppercase">How a change lands</p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {[
                { k: "Open a folder", v: "Same as VS Code. The agent indexes in the background." },
                { k: "Ask or tab", v: "Inline when you are in flow. Composer when the change is bigger than a line." },
                { k: "Accept the diff", v: "Every edit is reviewable. Nothing writes the repo without you." },
              ].map((step, i) => (
                <div key={step.k} className="rounded-md border border-white/5 bg-[#252526] p-5">
                  <p className="font-mono text-[11px] text-violet-300">{i + 1}</p>
                  <h3 className="mt-2 text-lg text-white">{step.k}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#9d9d9d]">{step.v}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#252526] px-4 py-16 md:px-8">
          <div className="mx-auto max-w-[1400px]">
            <p className="text-[11px] tracking-[0.2em] text-[#6a6a6a] uppercase">Extensions · family</p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {others.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="flex gap-4 rounded-md border border-white/5 bg-[#1e1e1e] p-4 hover:border-violet-400/30"
                >
                  <span
                    className="mt-1 size-10 shrink-0 rounded"
                    style={{ background: `linear-gradient(135deg, ${item.accent.from}, ${item.accent.to})` }}
                  />
                  <span>
                    <span className="block text-sm font-medium text-white">{item.name}</span>
                    <span className="mt-1 block text-[13px] text-[#9d9d9d]">{item.tagline}</span>
                    <span className="mt-2 block text-[12px] text-violet-300">Install from marketplace →</span>
                  </span>
                </a>
              ))}
            </div>
            <div className="mt-10 rounded-md border border-[#0e639c]/40 bg-[#0e639c]/10 p-5">
              <p className="text-sm text-white">Coming soon — this is a resume project, not a product launch.</p>
              <p className="mt-1 text-[13px] text-[#b5b5b5]">
                Star the repos, or wander over to{" "}
                <a href={PERSONAL_LINKS.blog} className="text-violet-300 underline">
                  the blog
                </a>
                .
              </p>
              <GithubButtons product={product} tone="ide" className="mt-4" />
            </div>
          </div>
        </section>
      </main>
      <footer className="flex h-7 items-center justify-between bg-[#007acc] px-3 font-mono text-[11px] text-white">
        <span>main*</span>
        <span>Ln 42, Col 8</span>
        <span>UTF-8</span>
        <span>TypeScript React</span>
        <a href={PERSONAL_LINKS.website} className="hover:underline">
          {AUTHOR.name}
        </a>
      </footer>
    </ProductShell>
  );
}
