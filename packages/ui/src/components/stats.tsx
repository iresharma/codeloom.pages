import { type Product } from "@codeloom/config";

import { NumberTicker } from "../magic/number-ticker";
import { Section } from "./section";

const stats = [
  { label: "Surfaces", value: 4, suffix: "" },
  { label: "Closed-source lines", value: 0, suffix: "" },
  { label: "Coming soon energy", value: 100, suffix: "%" },
];

export function Stats({ product }: { product: Product }) {
  return (
    <Section className="py-16 md:py-20">
      <div className="grid gap-8 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-10 md:grid-cols-3 md:px-10">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
              <NumberTicker value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-2 text-sm text-zinc-400">{stat.label}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-zinc-600">
        Accent for {product.shortName}: {product.accent.name}. Numbers are a joke. The source will not be.
      </p>
    </Section>
  );
}
