import { type Product } from "@codeloom/config";
import { type CSSProperties, type ReactNode } from "react";

import { cn } from "../lib/utils";

export function ProductShell({
  product,
  children,
  className,
}: {
  product: Product;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-product={product.id}
      className={cn("theme-product min-h-screen text-foreground", `theme-${product.id}`, className)}
      style={
        {
          "--product-accent": product.accent.solid,
          "--product-from": product.accent.from,
          "--product-to": product.accent.to,
          "--product-glow": product.accent.glow,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
