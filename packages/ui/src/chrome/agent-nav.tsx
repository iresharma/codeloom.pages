"use client";

import { useState } from "react";
import { AUTHOR, PERSONAL_LINKS, PRODUCT_LIST, type Product } from "@codeloom/config";
import { ExternalLink, Menu, X } from "lucide-react";

import { Logo } from "../components/logo";
import { cn } from "../lib/utils";

export function AgentNav({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex justify-center px-4 pt-4">
      <div className="flex w-full max-w-5xl items-center justify-between rounded-full border border-amber-200/10 bg-black/50 px-4 py-2 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <a href="/" className="flex items-center gap-2 pl-1">
          <Logo label="CodeLoom" />
        </a>
        <nav className="hidden items-center gap-1 md:flex">
          {PRODUCT_LIST.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={cn(
                "rounded-full px-3 py-1 text-[13px] transition",
                item.id === product.id
                  ? "bg-amber-400/15 text-amber-100"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white",
              )}
            >
              {item.shortName}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 pr-2 md:flex">
          <a
            href={PERSONAL_LINKS.blog}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[13px] text-zinc-400 hover:text-white"
          >
            Dispatch notes
            <ExternalLink className="size-3" />
          </a>
        </div>
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>
      {open ? (
        <div className="absolute top-16 right-4 left-4 rounded-2xl border border-white/10 bg-[#0c0a12] p-3 md:hidden">
          {PRODUCT_LIST.map((item) => (
            <a key={item.id} href={item.href} className="block rounded-lg px-3 py-2 text-sm text-zinc-200">
              {item.name}
            </a>
          ))}
          <a href={PERSONAL_LINKS.website} className="block px-3 py-2 text-sm text-zinc-500">
            {AUTHOR.websiteLabel}
          </a>
        </div>
      ) : null}
    </header>
  );
}
