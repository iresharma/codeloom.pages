import { PRODUCT_LIST, type Product } from "@codeloom/config";
import { ArrowUpRight } from "lucide-react";

import { Section, SectionHeading } from "./section";
import { cn } from "../lib/utils";

export function Ecosystem({ current }: { current: Product }) {
  const others = PRODUCT_LIST.filter((item) => item.id !== current.id);

  return (
    <Section>
      <SectionHeading
        eyebrow="Family"
        title="One loom, five surfaces"
        description="Engine, Agent, IDE, TUI, and CLI share the same experiments. Each surface is its own site."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {others.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-white/20 hover:bg-white/[0.04]"
          >
            <div
              className="mb-6 h-1.5 w-12 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${item.accent.from}, ${item.accent.to})`,
              }}
            />
            <p className="text-xs tracking-[0.2em] text-zinc-500 uppercase">Coming soon</p>
            <h3 className="mt-2 text-xl font-semibold text-white">{item.name}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{item.tagline}</p>
            <span className="mt-6 inline-flex items-center gap-1 text-sm text-zinc-300">
              Visit {item.shortName}
              <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </a>
        ))}
      </div>
    </Section>
  );
}
