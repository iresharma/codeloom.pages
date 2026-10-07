"use client";

import { PERSONAL_LINKS, PRODUCT_LIST, type Product } from "@codeloom/config";

import { cn } from "../lib/utils";

export function SiteNav({ active }: { active: Product["id"] | "home" | "try" }) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-white/10 bg-[#0c1014] px-5 py-3 font-mono text-[13px] md:px-8">
      <a href="/" className="flex items-center gap-2">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff5c33]/70" />
          <span className="relative inline-flex size-1.5 rounded-full bg-[#ff5c33]" />
        </span>
        <span className="font-bold text-[#d5dde3]">codeloom</span>
      </a>

      <nav className="hidden items-center gap-5 text-[#7a848c] sm:flex">
        {PRODUCT_LIST.map((item) => (
          <a
            key={item.id}
            href={item.path}
            className={cn(
              "transition-colors duration-150",
              item.id === active ? "text-[#d5dde3]" : "hover:text-[#d5dde3]",
            )}
          >
            {item.shortName.toLowerCase()}
          </a>
        ))}
        <a
          href="/try"
          className={cn(
            "transition-colors duration-150",
            active === "try" ? "text-[#ff5c33]" : "text-[#ff5c33]/80 hover:text-[#ff5c33]",
          )}
        >
          try it
        </a>
        <a href={PERSONAL_LINKS.blog} className="transition-colors duration-150 hover:text-[#d5dde3]">
          journal
        </a>
      </nav>

      <a
        href={PERSONAL_LINKS.github}
        target="_blank"
        rel="noreferrer"
        className="border border-white/15 px-3 py-1.5 text-[#d5dde3] transition-colors duration-150 hover:border-[#ff5c33]/50 hover:text-[#ff5c33]"
      >
        source
      </a>
    </header>
  );
}
