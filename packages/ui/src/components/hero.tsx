import { type ReactNode } from "react";
import { type Product } from "@codeloom/config";

import { ComingSoonBadge } from "./coming-soon-badge";
import { GithubButtons } from "./github-buttons";
import { GridPattern } from "../magic/grid-pattern";
import { Meteors } from "../magic/meteors";
import { cn } from "../lib/utils";

export function Hero({
  product,
  children,
  className,
}: {
  product: Product;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden", className)}>
      <GridPattern
        className="opacity-60 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]"
        squares={[
          [4, 3],
          [7, 2],
          [12, 6],
          [18, 4],
          [22, 8],
        ]}
      />
      <Meteors number={12} />
      <div
        className="pointer-events-none absolute left-1/2 top-[-120px] h-[420px] w-[720px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: product.accent.glow }}
      />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-5 pb-10 pt-16 text-center md:px-8 md:pt-24">
        <ComingSoonBadge product={product} />
        <h1 className="mt-8 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-7xl">
          {product.name}
        </h1>
        <p className="gradient-text mt-4 max-w-2xl text-xl font-medium md:text-2xl">{product.tagline}</p>
        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400 md:text-lg">{product.description}</p>
        <GithubButtons product={product} className="mt-8" />
        <p className="mt-4 text-xs text-zinc-500">
          {product.host} · MIT · a project by{" "}
          <a href="https://iresharma.com" className="underline decoration-white/20 underline-offset-2 hover:text-white">
            Iresh Sharma
          </a>
        </p>
        {children ? <div className="mt-14 w-full">{children}</div> : null}
      </div>
    </section>
  );
}
