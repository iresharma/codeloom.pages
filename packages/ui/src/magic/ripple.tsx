import { type CSSProperties, type ComponentPropsWithoutRef } from "react";

import { cn } from "../lib/utils";

interface RippleProps extends ComponentPropsWithoutRef<"div"> {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
}

export function Ripple({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 8,
  className,
  ...props
}: RippleProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,white,transparent)]",
        className,
      )}
      {...props}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70;
        const opacity = mainCircleOpacity - i * 0.03;
        const animationDelay = `${i * 0.06}s`;

        return (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 animate-ripple rounded-full border border-white/20"
            style={
              {
                width: size,
                height: size,
                opacity,
                animationDelay,
                "--duration": "2s",
                "--i": i,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
