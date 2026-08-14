"use client";

import { PERSONAL_LINKS, PRODUCT_LIST, type Product } from "@codeloom/config";

import { cn } from "../lib/utils";

const toc = [
  { href: "#name", label: "NAME" },
  { href: "#synopsis", label: "SYNOPSIS" },
  { href: "#description", label: "DESCRIPTION" },
  { href: "#options", label: "OPTIONS" },
  { href: "#examples", label: "EXAMPLES" },
  { href: "#see-also", label: "SEE ALSO" },
];

export function CliNav({ product }: { product: Product }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#1c1812]/10 bg-[#f4efe4]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <a href="/" className="font-mono text-[13px] font-semibold tracking-tight text-[#1c1812]">
          CODELOOM(1)
        </a>
        <nav className="hidden items-center gap-4 font-mono text-[11px] tracking-wide text-[#6b6358] md:flex">
          {toc.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-[#1c1812]">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3 font-mono text-[12px]">
          {PRODUCT_LIST.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={cn(
                "hover:text-[#0ea5e9]",
                item.id === product.id ? "text-[#0ea5e9]" : "text-[#6b6358]",
              )}
            >
              {item.shortName.toLowerCase()}
            </a>
          ))}
          <a href={PERSONAL_LINKS.website} className="hidden text-[#6b6358] hover:text-[#1c1812] sm:inline">
            author
          </a>
        </div>
      </div>
    </header>
  );
}
