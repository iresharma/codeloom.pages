import { PERSONAL_LINKS, type Product } from "@codeloom/config";

import { GithubButtons } from "./github-buttons";
import { RetroGrid } from "../magic/retro-grid";
import { Ripple } from "../magic/ripple";

export function Cta({ product }: { product: Product }) {
  return (
    <section className="relative overflow-hidden border-y border-white/5">
      <RetroGrid />
      <Ripple mainCircleSize={180} numCircles={6} className="opacity-40" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 py-24 text-center md:py-32">
        <p className="text-xs tracking-[0.25em] text-zinc-500 uppercase">Coming soon</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
          Star the repos. Read the rants. Watch it get built.
        </h2>
        <p className="mt-4 max-w-xl text-zinc-400">
          {product.name} is not for sale. It is an open-source resume project. Follow along on GitHub, or wander
          over to the blog and personal site.
        </p>
        <GithubButtons product={product} className="mt-8" />
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
          <a
            href={PERSONAL_LINKS.blog}
            target="_blank"
            rel="noreferrer"
            className="text-zinc-400 underline decoration-white/15 underline-offset-4 hover:text-white"
          >
            blog.iresharma.com
          </a>
          <span className="text-zinc-700">/</span>
          <a
            href={PERSONAL_LINKS.website}
            target="_blank"
            rel="noreferrer"
            className="text-zinc-400 underline decoration-white/15 underline-offset-4 hover:text-white"
          >
            iresharma.com
          </a>
        </div>
      </div>
    </section>
  );
}
