export type Severity = "critical" | "high" | "medium" | "low";

export type ReportFinding = {
  id: string;
  category: string;
  severity: Severity;
  file?: string;
  line?: number;
  agentId?: string;
  profile?: string;
  summary: string;
  detail: string;
  suggestedFix?: string;
};

export type FlowPhase = {
  profile: string;
  agentId: string;
  status: string;
  costUsd: number;
  tokens: number;
  toolCalls: number;
  judgeCalls: number;
  judgeFlags: number;
  why: string;
  topTools: { name: string; count: number }[];
  outcome: string;
  leftover: string;
};

export type DecisionFlow = {
  phases: FlowPhase[];
  settle: {
    profile: string;
    action: string;
    prUrl: string;
  } | null;
};

export type EngineResultReport = {
  slug: string;
  repo: string;
  prUrl: string;
  prNumber: number;
  runStatus: string;
  taskTitle: string;
  taskSummary: string;
  taskPrompt: string;
  stats: {
    costUsd: number;
    totalTokens: number;
    turns: number;
    toolCalls: number;
    elapsedSeconds: number;
    agentProfiles: string[];
  };
  verification: {
    language: string;
    builds: boolean;
    hasTests: boolean;
    testsPass: boolean;
  };
  decisionFlow: DecisionFlow;
  codeReview: {
    verdict: string;
    summary: string;
    findings: ReportFinding[];
  };
  processReview: {
    verdict: string;
    summary: string;
    followedNavigationHierarchy: boolean;
    readBeforeEditViolations: number;
    findings: ReportFinding[];
  };
  overallAssessment: {
    recommendation: string;
    narrative: string;
    strengths: string[];
    concerns: string[];
  };
  links: {
    prUrl: string;
    repoUrl: string;
    diffUrl: string;
  };
};
