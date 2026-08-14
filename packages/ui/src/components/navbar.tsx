"use client";

import { useState } from "react";
import { Menu, X, ExternalLink } from "lucide-react";
import { AUTHOR, PERSONAL_LINKS, PRODUCT_LIST, type Product } from "@codeloom/config";

import { Logo } from "./logo";
import { cn } from "../lib/utils";

export function Navbar({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#050507]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <a href={product.path === "/" ? "/" : product.path} className="flex items-center gap-2">
          <Logo />
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {PRODUCT_LIST.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm transition",
                item.id === product.id
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white",
              )}
            >
              {item.shortName}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href={PERSONAL_LINKS.blog}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white"
          >
            Blog
            <ExternalLink className="size-3" />
          </a>
          <a
            href={PERSONAL_LINKS.website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white"
          >
            {AUTHOR.websiteLabel}
            <ExternalLink className="size-3" />
          </a>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/5 bg-[#050507] px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {PRODUCT_LIST.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm",
                  item.id === product.id ? "bg-white/10 text-white" : "text-zinc-300",
                )}
                onClick={() => setOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <a href={PERSONAL_LINKS.blog} className="px-3 py-2 text-sm text-zinc-400">
              Blog
            </a>
            <a href={PERSONAL_LINKS.website} className="px-3 py-2 text-sm text-zinc-400">
              Personal site
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
