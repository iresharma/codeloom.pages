export type RunEvent = {
  sequence: number;
  kind: string;
  agent_id: string;
  title: string;
  detail: string;
  reasoning?: string;
  output?: string | null;
  ok?: boolean | null;
  duration_ms?: number | null;
};
export type RunAgent = {
  id: string;
  profile: string;
  parent_id: string | null;
  task: string;
  status: string;
  tool_calls: number;
  tools: { name: string; count: number }[];
};
export type RunRequest = {
  id: string | null;
  model: string | null;
  reasoning_effort: string | null;
  status: string;
  elapsed_s: number | null;
  first_byte_s: number | null;
  admission_queue_s: number | null;
  usage: { total_tokens?: number; cost?: number } | null;
  providers: string[];
  message_count: number;
  response: {
    text: string;
    reasoning: string;
    tool_calls: { id: string; name: string; arguments: string }[];
  };
};
export type RunView = {
  id: string;
  task_id: string;
  system: string;
  stage: string;
  synthetic: boolean;
  termination: string;
  passed: boolean;
  cost_usd: number | null;
  elapsed_s: number | null;
  retry_of: string | null;
  agents: RunAgent[];
  timeline: RunEvent[];
  requests: RunRequest[];
  checks: {
    kind: string;
    command: string;
    passed: boolean;
    output: string;
    repeat: number;
  }[];
  grading: Record<string, unknown>;
  patch: string;
  trace_available: boolean;
  tool_output_is_preview: boolean;
};
