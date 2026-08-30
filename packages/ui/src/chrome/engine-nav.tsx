"use client";

import { PERSONAL_LINKS, PRODUCT_LIST, type Product } from "@codeloom/config";

import { cn } from "../lib/utils";

export function EngineNav({ product }: { product: Product }) {
  return (
    <header className="sticky top-0 z-50 font-mono text-[11px] tracking-wide">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-[#ff5c33]/25 bg-[#080b0e] px-4 py-2 text-[#8ab4c8] md:px-6">
        <span className="inline-flex items-center gap-2 text-[#ff5c33]">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff5c33] opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-[#ff5c33]" />
          </span>
          LISTEN
        </span>
        <span className="text-[#ece8e1]">unix:///tmp/codeloom.sock</span>
        <span className="hidden sm:inline">ndjson</span>
        <span className="hidden md:inline text-[#f2c14e]">proto/0.x</span>
        <span className="ml-auto hidden lg:inline text-[#8ab4c8]/70">{product.host}</span>
      </div>
      <div className="flex flex-wrap items-center gap-x-1 gap-y-1 border-b border-white/8 bg-[#10161c] px-3 py-1.5 md:px-5">
        {PRODUCT_LIST.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={cn(
              "px-2 py-1 uppercase sm:px-2.5",
              item.id === product.id
                ? "bg-[#ff5c33] text-[#0c1014]"
                : "text-[#8ab4c8] hover:bg-white/5 hover:text-[#ece8e1]",
            )}
          >
            {item.shortName}
          </a>
        ))}
        <a
          href={PERSONAL_LINKS.blog}
          className="px-2 py-1 text-[#8ab4c8]/80 hover:text-[#f2c14e] sm:ml-auto"
        >
          journal
        </a>
      </div>
    </header>
  );
}
