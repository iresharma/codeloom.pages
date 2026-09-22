import { cn } from "../lib/utils";

export type EngineChapterId = "overview" | "read-funnel" | "write-funnel" | "agents" | "extend" | "results";

export const ENGINE_CHAPTERS: { id: EngineChapterId; n: string; label: string; href: string }[] = [
  { id: "overview", n: "00", label: "overview", href: "/engine" },
  { id: "read-funnel", n: "01", label: "read funnel", href: "/engine/read-funnel" },
  { id: "write-funnel", n: "02", label: "write funnel", href: "/engine/write-funnel" },
  { id: "agents", n: "03", label: "agents", href: "/engine/agents" },
  { id: "extend", n: "04", label: "extend", href: "/engine/extend" },
  { id: "results", n: "05", label: "results", href: "/engine/results" },
];

export function EngineSubNav({ active }: { active: EngineChapterId }) {
  return (
    <nav className="flex gap-6 overflow-x-auto border-b border-white/10 bg-[#0c1014] px-5 py-2.5 font-mono text-[12px] md:px-8">
      {ENGINE_CHAPTERS.map((chapter) => (
        <a
          key={chapter.id}
          href={chapter.href}
          aria-current={chapter.id === active ? "page" : undefined}
          className={cn(
            "shrink-0 whitespace-nowrap transition-colors duration-150",
            chapter.id === active
              ? "text-[#ff5c33] underline decoration-1 underline-offset-4"
              : "text-[#7a848c] hover:text-[#d5dde3]",
          )}
        >
          {chapter.n}.{chapter.label.replace(" ", "-")}
        </a>
      ))}
    </nav>
  );
}
