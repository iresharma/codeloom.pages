"use client";

import { AUTHOR, PERSONAL_LINKS, PRODUCT_LIST, PRODUCTS } from "@codeloom/config";

import { TuiNav } from "../chrome/tui-nav";
import { GithubButtons } from "../components/github-buttons";
import { ProductShell } from "../components/product-shell";
import { Scanlines } from "../fx/scanlines";
import { TuiMock } from "../mocks/tui-mock";

const product = PRODUCTS.tui;
const others = PRODUCT_LIST.filter((item) => item.id !== product.id);

const keys = [
  { bind: "hjkl", does: "move the tree. viewer follows." },
  { bind: ":CodeLoom", does: "open the agent pane on the current file." },
  { bind: "leader-a", does: "ask with visual selection as context." },
  { bind: "ctrl-w", does: "cycle explorer / viewer / agent." },
  { bind: "ZZ", does: "write the patch and quit the pane." },
  { bind: ":GitHub", does: "star the repos without leaving the session." },
];

export function TuiLanding() {
  return (
    <ProductShell product={product} className="relative bg-[#03140c] font-mono">
      <Scanlines />
      <TuiNav product={product} />
      <main className="relative z-10">
        <section className="px-4 py-10 md:px-8 md:py-14">
          <pre className="overflow-x-auto text-[10px] leading-[1.15] text-emerald-300 sm:text-xs md:text-sm">
{`  ██████╗ ██████╗ ██████╗ ███████╗██╗      ██████╗  ██████╗ ███╗   ███╗
  ██╔════╝██╔═══██╗██╔══██╗██╔════╝██║     ██╔═══██╗██╔═══██╗████╗ ████║
  ██║     ██║   ██║██║  ██║█████╗  ██║     ██║   ██║██║   ██║██╔████╔██║
  ██║     ██║   ██║██║  ██║██╔══╝  ██║     ██║   ██║██║   ██║██║╚██╔╝██║
  ╚██████╗╚██████╔╝██████╔╝███████╗███████╗╚██████╔╝╚██████╔╝██║ ╚═╝ ██║
   ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚══════╝ ╚═════╝  ╚═════╝ ╚═╝     ╚═╝
                              t u i   ·   n e t r w   +   a g e n t`}
          </pre>
          <p className="mt-6 max-w-3xl text-sm leading-7 text-emerald-100/80 md:text-base">
            Claude Code energy. A real workspace. Explorer, file viewer, and a persistent agent in one frame —
            modal by default, mouse optional, designed for people who already live in tmux.
          </p>
          <p className="mt-4 text-emerald-500">
            $ codeloom-tui .{" "}
            <span className="inline-block h-4 w-2 translate-y-px bg-emerald-300 align-middle animate-[caret_1s_step-end_infinite]" />
          </p>
          <GithubButtons product={product} tone="phosphor" className="mt-6" />
        </section>

        <section className="px-4 pb-10 md:px-8">
          <TuiMock />
        </section>

        <section className="grid gap-0 border-y border-emerald-500/20 md:grid-cols-2">
          <div className="border-b border-emerald-500/20 p-6 md:border-r md:border-b-0">
            <p className="text-emerald-500">:help keys</p>
            <table className="mt-4 w-full text-left text-sm">
              <tbody>
                {keys.map((row) => (
                  <tr key={row.bind} className="border-b border-emerald-900/60">
                    <th className="py-2 pr-4 font-normal text-emerald-300">{row.bind}</th>
                    <td className="py-2 text-emerald-100/70">{row.does}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6">
            <p className="text-emerald-500">:help loop</p>
            <ol className="mt-4 space-y-4 text-sm leading-6 text-emerald-100/80">
              <li>
                <span className="text-emerald-300">01</span> drop into a repo. explorer, viewer, and agent share the
                frame.
              </li>
              <li>
                <span className="text-emerald-300">02</span> point at a file. the viewer follows. the agent already has
                context.
              </li>
              <li>
                <span className="text-emerald-300">03</span> let it patch. review in the viewer. keep your fingers on
                the home row.
              </li>
            </ol>
            <p className="mt-8 text-emerald-600">--  coming soon  ·  open source  ·  {product.host}</p>
          </div>
        </section>

        <section className="p-6 md:p-8">
          <p className="text-emerald-500">:SeeAlso</p>
          <ul className="mt-3 space-y-1 text-sm">
            {others.map((item) => (
              <li key={item.id}>
                <a href={item.href} className="text-emerald-200 underline decoration-emerald-800 underline-offset-4">
                  {item.shortName.toLowerCase()}(1)
                </a>
                <span className="text-emerald-700"> — {item.tagline}</span>
              </li>
            ))}
            <li>
              <a href={PERSONAL_LINKS.blog} className="text-emerald-200 underline decoration-emerald-800 underline-offset-4">
                blog(7)
              </a>
              <span className="text-emerald-700"> — dispatch notes</span>
            </li>
          </ul>
        </section>
      </main>
      <footer className="relative z-10 flex flex-wrap items-center justify-between gap-2 bg-emerald-400 px-3 py-1 font-mono text-[11px] text-[#03140c]">
        <span>NORMAL</span>
        <span>explorer.rs</span>
        <span>utf-8</span>
        <span>unix</span>
        <a href={PERSONAL_LINKS.website} className="hover:underline">
          {AUTHOR.name}
        </a>
        <span>3:tui*</span>
      </footer>
    </ProductShell>
  );
}
