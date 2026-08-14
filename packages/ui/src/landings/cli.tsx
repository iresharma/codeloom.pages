"use client";

import { AUTHOR, PERSONAL_LINKS, PRODUCT_LIST, PRODUCTS } from "@codeloom/config";

import { CliNav } from "../chrome/cli-nav";
import { GithubButtons } from "../components/github-buttons";
import { ProductShell } from "../components/product-shell";
import { PaperGrain } from "../fx/paper-grain";
import { AnimatedSpan, Terminal, TypingAnimation } from "../magic/terminal";

const product = PRODUCTS.cli;
const others = PRODUCT_LIST.filter((item) => item.id !== product.id);

const options = [
  { flag: "fix", meaning: "Read a problem (file, stdin, or CI log) and write a patch to the working tree." },
  { flag: "--pr", meaning: "Open a pull request after the patch. Default is local-only." },
  { flag: "--json", meaning: "Emit machine-readable events on stdout. Compose with jq." },
  { flag: "--dry-run", meaning: "Plan and print the diff. Do not write files." },
  { flag: "--file <path>", meaning: "Limit context to one path. Repeatable." },
  { flag: "-h, --help", meaning: "Print this manual and exit." },
];

const toc = [
  { href: "#name", label: "NAME" },
  { href: "#synopsis", label: "SYNOPSIS" },
  { href: "#description", label: "DESCRIPTION" },
  { href: "#options", label: "OPTIONS" },
  { href: "#examples", label: "EXAMPLES" },
  { href: "#exit", label: "EXIT STATUS" },
  { href: "#see-also", label: "SEE ALSO" },
];

export function CliLanding() {
  return (
    <ProductShell product={product} className="relative bg-[#f4efe4]">
      <PaperGrain />
      <CliNav product={product} />
      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-[13rem_1fr] md:px-8 md:py-14">
        <aside className="hidden md:block">
          <nav className="sticky top-24 space-y-2 font-mono text-[11px] tracking-wide text-[#6b6358]">
            {toc.map((item) => (
              <a key={item.href} href={item.href} className="block hover:text-[#0ea5e9]">
                {item.label}
              </a>
            ))}
          </nav>
        </aside>
        <article className="max-w-3xl">
          <p className="font-mono text-[12px] tracking-[0.2em] text-[#6b6358]">
            CODELOOM(1) &nbsp;&nbsp; User Commands &nbsp;&nbsp; CODELOOM(1)
          </p>

          <section id="name" className="scroll-mt-24 pt-8">
            <h1 className="font-serif text-5xl text-[#1c1812] md:text-6xl">codeloom</h1>
            <p className="mt-3 text-lg leading-8 text-[#4a453c]">
              <span className="font-mono text-[15px] text-[#0ea5e9]">codeloom</span> — a coding agent you invoke like
              any other Unix tool. Pipe a stack trace in, get a patch out.
            </p>
            <GithubButtons product={product} tone="light" className="mt-6" />
          </section>

          <section id="synopsis" className="scroll-mt-24 border-t border-[#1c1812]/10 pt-8 mt-10">
            <h2 className="font-serif text-2xl">SYNOPSIS</h2>
            <pre className="mt-4 overflow-x-auto rounded-sm bg-[#1c1812] p-4 font-mono text-[13px] leading-7 text-[#e8e0d0]">
{`codeloom <command> [options] [file ...]
cat logs.txt | codeloom fix [--pr] [--json]
codeloom fix --file src/api.ts --dry-run`}
            </pre>
            <p className="mt-3 font-mono text-[12px] text-[#6b6358]">
              coming soon · {product.host} · MIT · {AUTHOR.name}
            </p>
          </section>

          <section id="description" className="scroll-mt-24 mt-10">
            <h2 className="font-serif text-2xl">DESCRIPTION</h2>
            <p className="mt-4 text-[17px] leading-8 text-[#3a352c]">
              CodeLoom CLI is the boring sibling. No editor chrome, no TUI, no dashboard. It speaks stdin, flags, exit
              codes, and a patch you can pipe into git. Non-interactive mode is the point: fail closed in GitHub
              Actions, leave a comment, not a mystery.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { k: "stdin → stdout", v: "Logs in, patch or PR URL out." },
                { k: "CI native", v: "--pr, --json, exit 1 on failure." },
                { k: "One binary", v: "Install it, alias it, forget the UI." },
              ].map((item) => (
                <div key={item.k} className="border border-[#1c1812]/10 bg-[#fffdf7] p-4">
                  <p className="font-mono text-[12px] text-[#0ea5e9]">{item.k}</p>
                  <p className="mt-2 text-sm leading-6 text-[#4a453c]">{item.v}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="options" className="scroll-mt-24 mt-10">
            <h2 className="font-serif text-2xl">OPTIONS</h2>
            <dl className="mt-4 divide-y divide-[#1c1812]/10 border-y border-[#1c1812]/10">
              {options.map((opt) => (
                <div key={opt.flag} className="grid gap-2 py-4 sm:grid-cols-[11rem_1fr]">
                  <dt className="font-mono text-[13px] text-[#0ea5e9]">{opt.flag}</dt>
                  <dd className="text-[15px] leading-7 text-[#3a352c]">{opt.meaning}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="examples" className="scroll-mt-24 mt-10">
            <h2 className="font-serif text-2xl">EXAMPLES</h2>
            <p className="mt-4 text-[15px] leading-7 text-[#4a453c]">
              Feed it a failing log. It edits locally. You still own <span className="font-mono">git add</span>.
            </p>
            <div className="mt-6 overflow-hidden rounded-sm border border-[#1c1812]/15">
              <Terminal title="zsh · ~/work/api" className="max-w-none rounded-none border-0 bg-[#1c1812]">
                <TypingAnimation className="text-[#a89f90]">$ cat logs/ci.txt | codeloom fix --pr</TypingAnimation>
                <AnimatedSpan className="text-sky-300">reading stdin · 2.4kb stack trace</AnimatedSpan>
                <AnimatedSpan className="text-[#a89f90]">model: local-first · tools: grep, patch, test</AnimatedSpan>
                <AnimatedSpan className="text-emerald-400">wrote src/queue.ts:88 timeout 5s → 15s</AnimatedSpan>
                <AnimatedSpan className="text-emerald-400">tests ok</AnimatedSpan>
                <TypingAnimation className="text-sky-200">PR https://github.com/you/api/pull/118</TypingAnimation>
              </Terminal>
            </div>
          </section>

          <section id="exit" className="scroll-mt-24 mt-10">
            <h2 className="font-serif text-2xl">EXIT STATUS</h2>
            <ul className="mt-4 space-y-2 font-mono text-[13px] text-[#3a352c]">
              <li>
                <span className="text-[#0ea5e9]">0</span> patch applied (or PR opened)
              </li>
              <li>
                <span className="text-[#0ea5e9]">1</span> tests failed or the model declined
              </li>
              <li>
                <span className="text-[#0ea5e9]">2</span> usage error
              </li>
            </ul>
          </section>

          <section id="see-also" className="scroll-mt-24 mt-10 pb-8">
            <h2 className="font-serif text-2xl">SEE ALSO</h2>
            <ul className="mt-4 space-y-2 text-[15px] text-[#3a352c]">
              {others.map((item) => (
                <li key={item.id}>
                  <a href={item.href} className="font-mono text-[#0ea5e9] underline decoration-[#0ea5e9]/30 underline-offset-4">
                    {item.shortName.toLowerCase()}(1)
                  </a>
                  <span className="text-[#6b6358]"> — {item.tagline}</span>
                </li>
              ))}
              <li>
                <a
                  href={PERSONAL_LINKS.blog}
                  className="font-mono text-[#0ea5e9] underline decoration-[#0ea5e9]/30 underline-offset-4"
                >
                  blog(7)
                </a>
                <span className="text-[#6b6358]"> — {AUTHOR.blogLabel}</span>
              </li>
            </ul>
          </section>
        </article>
      </div>
      <footer className="relative z-10 border-t border-[#1c1812]/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 font-mono text-[11px] text-[#6b6358] md:flex-row md:items-center md:justify-between md:px-8">
          <p>
            CodeLoom {new Date().getFullYear()} &nbsp; {AUTHOR.name} &nbsp; MIT
          </p>
          <p>CODELOOM(1) &nbsp; {product.host}</p>
        </div>
      </footer>
    </ProductShell>
  );
}
