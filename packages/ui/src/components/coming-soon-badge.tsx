import { type Product } from "@codeloom/config";

import { AnimatedGradientText } from "../magic/animated-gradient-text";
import { cn } from "../lib/utils";

export function ComingSoonBadge({ product, className }: { product: Product; className?: string }) {
  return (
    <div
      className={cn(
        "group relative mx-auto flex items-center justify-center rounded-full px-px py-px shadow-[inset_0_-8px_10px_#ffffff1f]",
        className,
      )}
    >
      <span
        className="absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-[length:300%_100%] p-[1px]"
        style={{
          backgroundImage: `linear-gradient(to right, ${product.accent.from}, ${product.accent.to}, ${product.accent.from})`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <AnimatedGradientText
        colorFrom={product.accent.from}
        colorTo={product.accent.to}
        className="inline-flex items-center gap-2 rounded-full bg-black/70 px-4 py-1.5 text-sm"
      >
        <span className="relative flex size-2">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
            style={{ background: product.accent.solid }}
          />
          <span className="relative inline-flex size-2 rounded-full" style={{ background: product.accent.solid }} />
        </span>
        Coming soon · open source
      </AnimatedGradientText>
    </div>
  );
}
