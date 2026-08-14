import { BorderBeam } from "../magic/border-beam";
import { AnimatedSpan, Terminal, TypingAnimation } from "../magic/terminal";
import { PRODUCTS } from "@codeloom/config";

const product = PRODUCTS.agent;

export function AgentMock() {
  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="absolute -inset-8 rounded-[32px] bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.18),transparent_70%)] blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
        <BorderBeam colorFrom={product.accent.from} colorTo={product.accent.to} size={120} />
        <Terminal title="codeloom agent · sandbox · main" className="max-w-none rounded-none border-0 bg-black/80">
          <TypingAnimation className="text-zinc-400">$ codeloom run "fix the flaky auth test and open a PR"</TypingAnimation>
          <AnimatedSpan className="text-amber-300">▸ planning  ·  exploring repo graph</AnimatedSpan>
          <AnimatedSpan className="text-zinc-400">  found 14 files touching auth · 3 failing tests</AnimatedSpan>
          <AnimatedSpan className="text-emerald-400">✔ patched apps/api/src/auth.spec.ts</AnimatedSpan>
          <AnimatedSpan className="text-emerald-400">✔ patched apps/api/src/session.ts</AnimatedSpan>
          <AnimatedSpan className="text-sky-400">ℹ ran pnpm test --filter=api</AnimatedSpan>
          <AnimatedSpan className="text-emerald-400">✔ 128 passed  0 failed</AnimatedSpan>
          <TypingAnimation className="text-zinc-300">opened PR #42 · "Stabilize session cookie in CI"</TypingAnimation>
        </Terminal>
      </div>
    </div>
  );
}
