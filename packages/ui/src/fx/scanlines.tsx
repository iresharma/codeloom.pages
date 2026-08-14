import { cn } from "../lib/utils";

export function Scanlines({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 z-20 mix-blend-overlay",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(0,0,0,0.18)_0px,rgba(0,0,0,0.18)_1px,transparent_1px,transparent_3px)] opacity-50" />
      <div className="absolute inset-0 animate-crt-flicker bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.45)_100%)]" />
    </div>
  );
}
