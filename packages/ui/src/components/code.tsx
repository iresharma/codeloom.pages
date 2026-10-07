import { type ReactNode } from "react";

import { cn } from "../lib/utils";

// A tiny, dependency-free highlighter for the short snippets on the site.
// It is deliberately coarse — comments, strings, numbers, and a per-language
// keyword set — which is plenty for a trace, a Dockerfile, or a few shell lines.

const KEYWORDS: Record<string, Set<string>> = {
  http: new Set(["curl", "ws", "GET", "POST", "PUT", "PATCH", "DELETE"]),
  dockerfile: new Set([
    "FROM", "AS", "RUN", "COPY", "ADD", "ENV", "ARG", "WORKDIR", "CMD",
    "ENTRYPOINT", "EXPOSE", "LABEL", "USER", "VOLUME", "SHELL", "HEALTHCHECK",
  ]),
  bash: new Set([
    "cd", "export", "source", "pip", "python", "python3", "npm", "pnpm",
    "docker", "uvicorn", "git", "gh", "for", "in", "do", "done", "playwright",
  ]),
};

const CLS = {
  comment: "text-[#6b7686] italic",
  string: "text-[#e0b36b]",
  number: "text-[#7ee0b8]",
  keyword: "text-[#5cc8ff]",
} as const;

const TOKEN =
  /(#[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(\d[\w.]*)\b|([A-Za-z_][\w./@-]*)/g;

function highlight(code: string, lang: string): ReactNode[] {
  const keywords = KEYWORDS[lang] ?? new Set<string>();
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let match: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  while ((match = TOKEN.exec(code)) !== null) {
    if (match.index > last) out.push(code.slice(last, match.index));
    const [whole, comment, str, num, ident] = match;
    if (comment) {
      out.push(<span key={key++} className={CLS.comment}>{comment}</span>);
    } else if (str) {
      out.push(<span key={key++} className={CLS.string}>{str}</span>);
    } else if (num) {
      out.push(<span key={key++} className={CLS.number}>{num}</span>);
    } else if (ident && keywords.has(ident)) {
      out.push(<span key={key++} className={CLS.keyword}>{ident}</span>);
    } else {
      out.push(whole);
    }
    last = match.index + whole.length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

export function Code({
  code,
  lang,
  className,
}: {
  code: string;
  lang: string;
  className?: string;
}) {
  return (
    <pre
      className={cn(
        "overflow-x-auto border border-white/10 bg-[#0a0d10] p-4 font-mono text-[12.5px] leading-6 text-[#d5dde3]",
        className,
      )}
    >
      <code>{highlight(code, lang)}</code>
    </pre>
  );
}
