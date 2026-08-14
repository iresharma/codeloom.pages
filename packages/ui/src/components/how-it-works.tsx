import { Section, SectionHeading } from "./section";

export function HowItWorks({
  steps,
}: {
  steps: { title: string; body: string }[];
}) {
  return (
    <Section>
      <SectionHeading
        eyebrow="How it works"
        title="A short loop. Then a pull request."
        description="No magic beyond a model, a sandbox, and the same git primitives you already trust."
      />
      <ol className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
          >
            <span className="font-mono text-xs text-zinc-500">0{index + 1}</span>
            <h3 className="mt-3 text-lg font-semibold text-white">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
