// Placeholder frame for product screenshots.
// To add real screenshots, drop files into `apps/web/public/screenshots/`
// and pass `src="/screenshots/<name>.png"` — the frame stays the same.
import { ImageIcon } from "lucide-react";

import { cn } from "../lib/utils";

type ScreenshotPlaceholderProps = {
  label: string;
  caption?: string;
  src?: string;
  aspect?: string;
  className?: string;
};

export function ScreenshotPlaceholder({
  label,
  caption,
  src,
  aspect = "aspect-video",
  className,
}: ScreenshotPlaceholderProps) {
  return (
    <figure className={cn("flex flex-col", className)}>
      <div className="overflow-hidden border border-white/10 bg-[#0a0d10]">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
        </div>
        <div className={cn("relative w-full", aspect)}>
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={label} className="h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-3 flex flex-col items-center justify-center gap-2 border border-dashed border-white/15 text-center">
              <ImageIcon className="size-6 text-[#7a848c]/70" aria-hidden />
              <span className="px-3 font-mono text-[10px] tracking-[0.08em] text-[#7a848c]/80 uppercase">
                screenshot · {label}
              </span>
            </div>
          )}
        </div>
      </div>
      {caption ? (
        <figcaption className="mt-2 font-mono text-[11px] leading-5 text-[#7a848c]">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
