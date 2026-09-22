import type { EngineResultReport, ReportFinding, Severity } from "./types";

const RANK: Record<Severity, number> = { low: 0, medium: 1, high: 2, critical: 3 };

function maxSeverityOf(findings: ReportFinding[]): Severity | null {
  if (findings.length === 0) return null;
  return findings.reduce<Severity>((max, f) => (RANK[f.severity] > RANK[max] ? f.severity : max), findings[0].severity);
}

export function maxSeverity(report: EngineResultReport): Severity | null {
  return maxSeverityOf([...report.codeReview.findings, ...report.processReview.findings]);
}

/**
 * The raw `needs-changes` / `request-changes` verdicts read as a hard pass/fail,
 * which overstates runs whose only findings are low/medium nits — a real problem
 * for a page whose job is to show the review process off. Recompute the label
 * from the actual severity mix so "needs changes" only fires when something
 * high/critical is actually behind it; everything else reads as "minor fixes".
 */
function findingsTone(findings: ReportFinding[]): { label: string; color: string } {
  const sev = maxSeverityOf(findings);
  if (sev === null) return { label: "clean", color: "#34d399" };
  if (sev === "high" || sev === "critical") return { label: "needs changes", color: "#f2c14e" };
  return { label: "minor fixes", color: "#f2c14e" };
}

export function recommendationTone(report: EngineResultReport): { label: string; color: string } {
  if (report.overallAssessment.recommendation === "merge") {
    return { label: "merge-ready", color: "#34d399" };
  }
  return findingsTone([...report.codeReview.findings, ...report.processReview.findings]);
}

export function codeQualityTone(report: EngineResultReport): { label: string; color: string } {
  return findingsTone(report.codeReview.findings);
}
