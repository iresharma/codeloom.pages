import {
  ArrowRight,
  Check,
  Code2,
  FlaskConical,
  GitBranch,
  Search,
} from "lucide-react";
import { panelClass, titleClass } from "./charts";

const grades = [
  {
    icon: Code2,
    title: "Bug fixes & features",
    rule: "Hidden behavior checks + upstream tests",
    threshold: "All required checks pass",
  },
  {
    icon: Search,
    title: "Code navigation",
    rule: "JSON schema + symbols, edges and claims",
    threshold: "Matches the pinned-source rubric",
  },
  {
    icon: FlaskConical,
    title: "Test generation",
    rule: "Pass correct code · detect planted bugs",
    threshold: "≥4/5 mutants killed stably across 3 runs",
  },
];

export function GradingGuide() {
  return (
    <section className="py-6">
      <h2 className={titleClass}>How a run earns a pass</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {grades.map((g) => (
          <div className={panelClass} key={g.title}>
            <g.icon
              className="mb-4 h-5 w-5 text-[#7eb5d0]"
              aria-hidden="true"
            />
            <h3 className={titleClass}>{g.title}</h3>
            <p className="mt-3 text-xs leading-6 text-[#9ba6af]">{g.rule}</p>
            <p className="mt-4 border-t border-white/10 pt-3 text-xs leading-5 text-[#8ccf9f]">
              {g.threshold}
            </p>
          </div>
        ))}
      </div>
      <ol
        className="mt-5 flex flex-wrap items-center gap-3 text-xs text-[#c3cbd1]"
        aria-label="Evaluation pipeline"
      >
        {[
          "Seal final checkout",
          "Reject forbidden edits",
          "Rebuild in clean evaluator",
          "Run deterministic graders",
        ].map((s, i) => (
          <li key={s} className="flex items-center gap-3">
            <span className="border border-white/10 px-3 py-3">
              <span className="mr-2 font-mono text-[#ff5c33]">0{i + 1}</span>
              {s}
            </span>
            {i < 3 && (
              <ArrowRight
                className="h-3 w-3 text-[#9ba6af]"
                aria-hidden="true"
              />
            )}
          </li>
        ))}
      </ol>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="flex items-start gap-3 text-xs leading-6 text-[#9ba6af]">
          <Check
            className="mt-1 h-4 w-4 shrink-0 text-[#8ccf9f]"
            aria-hidden="true"
          />
          <p>
            Both can pass with different implementations. Compare solved task
            pairs first, then cost per success, time and regressions.
          </p>
        </div>
        <div className="flex items-start gap-3 text-xs leading-6 text-[#9ba6af]">
          <GitBranch
            className="mt-1 h-4 w-4 shrink-0 text-[#7eb5d0]"
            aria-hidden="true"
          />
          <p>
            Same task, model and budget. Only the final main checkout counts,
            including child changes merged into it.
          </p>
        </div>
      </div>
      <details className="mt-4 text-xs leading-6 text-[#9ba6af]">
        <summary className="min-h-11 cursor-pointer py-3 text-[#d5dde3]">
          Grading limits & fairness
        </summary>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Agents cannot access evaluator tests during a run or edit existing
            tests/configuration. Generated tests must fail through behavioral
            assertions; build/import errors do not count as mutant kills.
          </li>
          <li>
            Model claims and self-review verdicts do not determine benchmark
            success. The earlier case studies use qualitative reviews and are
            separate.
          </li>
          <li>
            Hidden tests are finite: a pass proves the tested contract, not
            every possible behavior. The author-designed corpus has no
            independent review.
          </li>
          <li>
            Cost per success includes failed runs and eligible infrastructure
            retries. Unresolved costs stay unknown. One run per system estimates
            whole-system differences, not reliability or individual component
            effects.
          </li>
        </ul>
      </details>
    </section>
  );
}
