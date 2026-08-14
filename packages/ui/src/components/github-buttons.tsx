import { Github } from "lucide-react";
import { type Product } from "@codeloom/config";

import { ShimmerButton } from "../magic/shimmer-button";
import { cn } from "../lib/utils";

export function GithubButtons({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-3 sm:flex-row", className)}>
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
