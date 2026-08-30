import { Github } from "lucide-react";
import { type Product } from "@codeloom/config";

import { ShimmerButton } from "../magic/shimmer-button";
import { cn } from "../lib/utils";

type Tone = "dark" | "light" | "phosphor" | "ide" | "engine";

export function GithubButtons({
  product,
  className,
  tone = "dark",
}: {
  product: Product;
  className?: string;
  tone?: Tone;
}) {
  if (tone === "light") {
    return (
      <div className={cn("flex flex-col items-start gap-3 sm:flex-row", className)}>
        <a
          href={product.motherRepo}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-sm bg-[#1c1812] px-5 py-2.5 text-sm font-medium text-[#f4efe4] hover:bg-black"
        >
          <Github className="size-4" />
          Mother repo
        </a>
        <a
          href={product.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-sm border border-[#1c1812]/20 bg-white px-5 py-2.5 text-sm font-medium text-[#1c1812] hover:border-[#1c1812]/40"
        >
          <Github className="size-4" />
          {product.shortName} repo
        </a>
      </div>
    );
  }

  if (tone === "phosphor") {
    return (
      <div className={cn("flex flex-col gap-2 font-mono text-sm sm:flex-row sm:items-center sm:gap-4", className)}>
        <a
          href={product.motherRepo}
          target="_blank"
          rel="noreferrer"
          className="text-emerald-300 underline decoration-emerald-700 underline-offset-4 hover:text-emerald-100"
        >
          :GitHub mother
        </a>
        <span className="hidden text-emerald-800 sm:inline">·</span>
        <a
          href={product.github}
          target="_blank"
          rel="noreferrer"
          className="text-emerald-300 underline decoration-emerald-700 underline-offset-4 hover:text-emerald-100"
        >
          :GitHub tui
        </a>
      </div>
    );
  }

  if (tone === "ide") {
    return (
      <div className={cn("flex flex-wrap items-center gap-2", className)}>
        <a
          href={product.motherRepo}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-[#0e639c] px-3 py-1.5 text-[13px] text-white hover:bg-[#1177bb]"
        >
          <Github className="size-3.5" />
          Clone mother repo
        </a>
        <a
          href={product.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-[13px] text-[#cccccc] hover:bg-white/10"
        >
          Open IDE repo
        </a>
      </div>
    );
  }

  if (tone === "engine") {
    return (
      <div className={cn("flex flex-col items-start gap-3 sm:flex-row", className)}>
        <a
          href={product.motherRepo}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 border border-[#ff5c33] bg-[#ff5c33] px-5 py-2.5 font-mono text-[13px] font-medium tracking-wide text-[#0c1014] transition duration-200 hover:-translate-y-px hover:bg-[#ff7a55] active:translate-y-px"
        >
          <Github className="size-4" />
          Mother repo
        </a>
        <a
          href={product.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 border border-[#ff5c33]/40 bg-transparent px-5 py-2.5 font-mono text-[13px] tracking-wide text-[#ece8e1] transition duration-200 hover:-translate-y-px hover:border-[#ff5c33] hover:text-white active:translate-y-px"
        >
          <Github className="size-4" />
          Engine repo
        </a>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-start gap-3 sm:flex-row", className)}>
      <ShimmerButton
        href={product.motherRepo}
        target="_blank"
        rel="noreferrer"
        background="#111113"
        className="gap-2 text-sm font-medium"
      >
        <Github className="size-4" />
        Mother repo
      </ShimmerButton>
      <a
        href={product.github}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
      >
        <Github className="size-4" />
        {product.shortName} repo
      </a>
    </div>
  );
}
