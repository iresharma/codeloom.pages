import { AUTHOR, PERSONAL_LINKS, type Product } from "@codeloom/config";
import { ArrowRight } from "lucide-react";

import { ENGINE_CHAPTERS, type EngineChapterId } from "./engine-subnav";

export function EngineChapterNav({ active }: { active: EngineChapterId }) {
  const i = ENGINE_CHAPTERS.findIndex((c) => c.id === active);
  const next = i < ENGINE_CHAPTERS.length - 1 ? ENGINE_CHAPTERS[i + 1] : ENGINE_CHAPTERS[0];

  return (
    <a
      href={next.href}
      className="group flex items-center justify-between border-t border-white/10 px-5 py-6 font-mono text-[13px] transition-colors duration-150 hover:bg-white/[0.02] md:px-8"
    >
      <span className="text-[#7a848c]">{i === ENGINE_CHAPTERS.length - 1 ? "back to" : "next"}</span>
      <span className="flex items-center gap-2 text-[#d5dde3] group-hover:text-[#ff5c33]">
        {next.n}.{next.label}
        <ArrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-1" />
      </span>
    </a>
  );
}

export function EngineFooter({ product }: { product: Product }) {
  return (
    <footer className="grid grid-cols-2 divide-white/10 border-t border-white/10 font-mono text-[12px] text-[#7a848c] sm:grid-cols-4 sm:divide-x">
      <div className="px-5 py-4">{AUTHOR.name} · BUSL 1.1</div>
      <a href={product.github} className="border-t border-white/10 px-5 py-4 transition-colors hover:text-[#ff5c33] sm:border-t-0">
        source
      </a>
      <a href={PERSONAL_LINKS.blog} className="border-t border-white/10 px-5 py-4 transition-colors hover:text-[#ff5c33] sm:border-t-0">
        journal
      </a>
      <a href={PERSONAL_LINKS.website} className="border-t border-white/10 px-5 py-4 transition-colors hover:text-[#ff5c33] sm:border-t-0">
        {AUTHOR.websiteLabel}
      </a>
    </footer>
  );
}
