"use client";

import { motion } from "motion/react";

import { cn } from "../lib/utils";

const paths = [
  "M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875",
  "M-331 -179C-331 -179 -263 226 201 353C665 480 733 885 733 885",
  "M-273 -161C-273 -161 -205 244 259 371C723 498 791 903 791 903",
  "M-228 -148C-228 -148 -160 257 304 384C768 511 836 916 836 916",
  "M-175 -136C-175 -136 -107 269 357 396C821 523 889 928 889 928",
  "M-122 -122C-122 -122 -54 283 410 410C874 537 942 942 942 942",
  "M-74 -108C-74 -108 -6 297 458 424C922 551 990 956 990 956",
  "M-28 -95C-28 -95 40 310 504 437C968 564 1036 969 1036 969",
];

export function BackgroundBeams({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <svg className="absolute h-full w-full" width="100%" height="100%" viewBox="0 0 696 316" fill="none">
        <defs>
          <linearGradient id="codeloom-beam" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--product-from, #ffaa40)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--product-to, #9c40ff)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--product-from, #ffaa40)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {paths.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            stroke="url(#codeloom-beam)"
            strokeWidth="0.6"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 0], opacity: [0, 0.8, 0] }}
            transition={{
              duration: 7 + i * 0.35,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-transparent to-transparent" />
    </div>
  );
}
