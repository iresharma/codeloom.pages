import { PRODUCTS } from "@codeloom/config";

import { BorderBeam } from "../magic/border-beam";
import { AnimatedSpan, Terminal, TypingAnimation } from "../magic/terminal";

const product = PRODUCTS.cli;

export function CliMock() {
  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="absolute -inset-8 rounded-[32px] bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.18),transparent_70%)] blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
        <BorderBeam colorFrom={product.accent.from} colorTo={product.accent.to} size={120} />
        <Terminal title="zsh · ~/work/api" className="max-w-none rounded-none border-0 bg-black/80">
          <TypingAnimation className="text-zinc-400">$ cat logs/ci.txt | codeloom fix --pr</TypingAnimation>
          <AnimatedSpan className="text-sky-300">reading stdin · 2.4kb stack trace</AnimatedSpan>
          <AnimatedSpan className="text-zinc-400">model: local-first  ·  tools: grep, patch, test</AnimatedSpan>
          <AnimatedSpan className="text-emerald-400">wrote src/queue.ts:88  timeout 5s → 15s</AnimatedSpan>
          <AnimatedSpan className="text-emerald-400">tests  ok</AnimatedSpan>
          <TypingAnimation className="text-sky-200">PR https://github.com/you/api/pull/118</TypingAnimation>
        </Terminal>
      </div>
    </div>
  );
}
