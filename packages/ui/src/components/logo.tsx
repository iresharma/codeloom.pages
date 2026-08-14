"use client";

import { useId } from "react";

import { cn } from "../lib/utils";

export function Logo({ className, markOnly }: { className?: string; markOnly?: boolean }) {
  const id = useId();

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg viewBox="0 0 32 32" className="size-7 shrink-0" aria-hidden>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="32" y2="32">
            <stop offset="0%" stopColor="var(--product-from, #ffaa40)" />
            <stop offset="100%" stopColor="var(--product-to, #9c40ff)" />
          </linearGradient>
        </defs>
        <rect x="1.5" y="1.5" width="29" height="29" rx="8" fill="none" stroke={`url(#${id})`} strokeWidth="1.5" />
        <path
          d="M8 11c4 0 4 10 8 10s4-10 8-10"
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M8 21c4 0 4-10 8-10s4 10 8 10"
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
      {markOnly ? null : (
        <span className="text-[15px] font-semibold tracking-tight text-white">CodeLoom</span>
      )}
    </span>
  );
}
