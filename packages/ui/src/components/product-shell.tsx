import { type Product } from "@codeloom/config";
import { type ReactNode } from "react";

import { Cta } from "./cta";
import { Ecosystem } from "./ecosystem";
import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { Stats } from "./stats";
import { cn } from "../lib/utils";

export function ProductShell({
  product,
  children,
}: {
  product: Product;
  children: ReactNode;
}) {
  return (
    <div
      className={cn("min-h-screen bg-background text-foreground")}
      style={
        {
          "--product-accent": product.accent.solid,
          "--product-from": product.accent.from,
          "--product-to": product.accent.to,
        } as React.CSSProperties
      }
    >
      <Navbar product={product} />
      <main>{children}</main>
      <Stats product={product} />
      <Ecosystem current={product} />
      <Cta product={product} />
      <Footer product={product} />
    </div>
  );
}
