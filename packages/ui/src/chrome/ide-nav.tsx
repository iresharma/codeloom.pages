"use client";

import { useState } from "react";
import { AUTHOR, PERSONAL_LINKS, PRODUCT_LIST, type Product } from "@codeloom/config";
import { Menu, X } from "lucide-react";

import { cn } from "../lib/utils";

export function IdeNav({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 text-[#cccccc]">
      <div className="flex h-9 items-center gap-3 border-b border-black/40 bg-[#3c3c3c] px-3 text-[12px]">
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="hidden text-[#9d9d9d] sm:inline">File</span>
        <span className="hidden text-[#9d9d9d] sm:inline">Edit</span>
        <span className="hidden text-[#9d9d9d] sm:inline">Selection</span>
        <span className="text-white">Agent</span>
        <span className="hidden text-[#9d9d9d] md:inline">View</span>
        <span className="mx-auto truncate font-medium text-[#e6e6e6]">{product.name} — untitled workspace</span>
        <button
          type="button"
          className="inline-flex size-7 items-center justify-center rounded md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>
      <div className="hidden h-9 items-end border-b border-black/40 bg-[#252526] px-1 md:flex">
        {PRODUCT_LIST.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={cn(
              "rounded-t-md border border-transparent px-4 py-1.5 text-[13px]",
              item.id === product.id
                ? "border-black/20 border-b-[#1e1e1e] bg-[#1e1e1e] text-white"
                : "text-[#9d9d9d] hover:bg-white/5",
            )}
          >
            {item.shortName.toLowerCase()}.tsx
          </a>
        ))}
        <a
          href={PERSONAL_LINKS.website}
          target="_blank"
          rel="noreferrer"
          className="ml-auto hidden items-center px-4 py-1.5 text-[12px] text-[#9d9d9d] hover:text-white lg:flex"
        >
          {AUTHOR.websiteLabel}
        </a>
      </div>
      {open ? (
        <div className="border-b border-black/40 bg-[#252526] px-3 py-3 md:hidden">
          {PRODUCT_LIST.map((item) => (
            <a key={item.id} href={item.href} className="block py-1.5 text-sm text-[#cccccc]">
              {item.name}
            </a>
          ))}
        </div>
      ) : null}
    </header>
  );
}
