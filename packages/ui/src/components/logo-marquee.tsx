import { cn } from "../lib/utils";

const items = [
  "TypeScript",
  "Python",
  "Rust",
  "Go",
  "Neovim",
  "VS Code",
  "GitHub",
  "Docker",
  "Next.js",
  "Linux",
];

export function LogoMarquee({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#050507]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#050507]" />
      <p className="mb-6 text-center text-xs tracking-[0.25em] text-zinc-500 uppercase">
        Aimed at the tools you already live in
      </p>
      <div className="flex overflow-hidden [--duration:32s] [--gap:2.5rem]">
        <div className="animate-marquee flex shrink-0 items-center gap-[2.5rem]">
          {items.concat(items).map((item, i) => (
            <span key={`${item}-${i}`} className="text-sm font-medium tracking-wide text-zinc-500">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
