import { type LucideIcon } from "lucide-react";

import { BentoCard, BentoGrid } from "../magic/bento-grid";
import { Marquee } from "../magic/marquee";
import { Section, SectionHeading } from "../components/section";
import { cn } from "../lib/utils";

export type FeatureCard = {
  Icon: LucideIcon;
  name: string;
  description: string;
  className: string;
  items?: string[];
};

export function FeatureBento({
  eyebrow,
  title,
  description,
  features,
}: {
  eyebrow: string;
  title: string;
  description: string;
  features: FeatureCard[];
}) {
  return (
    <Section>
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <BentoGrid>
        {features.map((feature) => (
          <BentoCard
            key={feature.name}
            {...feature}
            background={
              feature.items ? (
                <Marquee
                  pauseOnHover
                  className="absolute top-10 [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] [--duration:20s]"
                >
                  {feature.items.map((item) => (
                    <figure
                      key={item}
                      className={cn(
                        "relative w-40 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4",
                        "transform-gpu blur-[0.3px] transition-all duration-300 group-hover:blur-none",
                      )}
                    >
                      <figcaption className="text-sm font-medium text-white">{item}</figcaption>
                    </figure>
                  ))}
                </Marquee>
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06),transparent_45%)]" />
              )
            }
          />
        ))}
      </BentoGrid>
    </Section>
  );
}
