"use client";

import { PERSONAL_LINKS, PRODUCT_LIST, type Product } from "@codeloom/config";

import { cn } from "../lib/utils";

export function TuiNav({ product }: { product: Product }) {
  return (
    <header className="sticky top-0 z-50 font-mono text-[12px] leading-none">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 bg-[#0b3d2c] px-3 py-2 text-emerald-50">
        <span className="bg-emerald-300 px-1.5 py-0.5 font-semibold text-[#03140c]">codeloom-tui</span>
        {PRODUCT_LIST.map((item, i) => (
          <a
            key={item.id}
            href={item.href}
            className={cn(
              "px-1.5 py-0.5",
              item.id === product.id ? "bg-emerald-200/20 text-white" : "text-emerald-100/70 hover:text-white",
            )}
          >
            {i + 1}:{item.shortName.toLowerCase()}
            {item.id === product.id ? "*" : ""}
          </a>
        ))}
        <span className="ml-auto hidden text-emerald-100/60 sm:inline">"nvim"  zsh  14:02  {product.host}</span>
      </div>
      <div className="flex items-center justify-between bg-[#03140c] px-3 py-1 text-emerald-500/80">
        <span>-- NORMAL --</span>
        <a href={PERSONAL_LINKS.blog} className="hover:text-emerald-200">
          :help blog
        </a>
      </div>
    </header>
  );
}
