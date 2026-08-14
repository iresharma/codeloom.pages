import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "../lib/utils";

export function BentoGrid({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[19rem] grid-cols-1 gap-4 md:auto-rows-[22rem] md:grid-cols-3",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: {
  name: string;
  className: string;
  background: ReactNode;
  Icon: React.ElementType;
  description: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div
      className={cn(
        "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl",
        "border border-white/10 bg-white/[0.02] transform-gpu",
        className,
      )}
    >
      <div>{background}</div>
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-4">
        <Icon className="h-10 w-10 origin-left transform-gpu text-zinc-300 transition-all duration-300 ease-in-out group-hover:scale-75" />
        <h3 className="text-xl font-semibold text-white">{name}</h3>
        <p className="max-w-lg text-sm text-zinc-400">{description}</p>
      </div>
      {href && cta ? (
        <div className="pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <a
            href={href}
            className="pointer-events-auto inline-flex items-center gap-1 text-sm font-medium text-white"
          >
            {cta}
            <ArrowRight className="size-4" />
          </a>
        </div>
      ) : null}
      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-white/[0.03]" />
    </div>
  );
}
