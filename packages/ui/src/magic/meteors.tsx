"use client";

import { useEffect, useState } from "react";

import { cn } from "../lib/utils";

interface MeteorsProps {
  number?: number;
  className?: string;
}

type Meteor = { id: number; top: number; left: number; delay: number; duration: number };

export function Meteors({ number = 20, className }: MeteorsProps) {
  // Randomized client-side only, after mount — computing this during render
  // would make the SSR pass and the client hydration pass disagree.
  const [meteors, setMeteors] = useState<Meteor[]>([]);

  useEffect(() => {
    setMeteors(
      Array.from({ length: number }).map((_, idx) => ({
        id: idx,
        top: Math.floor(Math.random() * 80),
        left: Math.floor(Math.random() * 100),
        delay: Math.random() * 1.6,
        duration: Math.floor(Math.random() * 8) + 4,
      })),
    );
  }, [number]);

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className="animate-meteor absolute h-px w-px rounded-full bg-white shadow-[0_0_0_1px_#ffffff10]"
          style={{
            top: `${meteor.top}%`,
            left: `${meteor.left}%`,
            animationDelay: `${meteor.delay}s`,
            animationDuration: `${meteor.duration}s`,
            "--angle": "215deg",
          } as React.CSSProperties}
        >
          <span className="absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2 bg-gradient-to-r from-white to-transparent" />
        </span>
      ))}
    </div>
  );
}
