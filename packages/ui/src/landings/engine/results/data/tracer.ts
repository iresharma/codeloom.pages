import type { EngineResultReport } from "../types";

export const tracerReport: EngineResultReport = {
  slug: "tracer",
  repo: "iresharma/tracer",
  prUrl: "https://github.com/iresharma/tracer/pull/1",
  prNumber: 1,
  runStatus: "ok",
  taskTitle: "Authentication in front of the collector",
  taskSummary:
    "Close a gap the repo's own README flags: no authentication in front of the collector UI or API. Add a self-hosted token/basic-auth scheme, wired through the existing config mechanism, with a separate credential for the service-to-service ingest path. Table-driven tests, go test / make vet / make fmt all clean, plus manifest and doc updates.",
  taskPrompt:
    'This repo\'s own README, in the "Status" section, flags a real gap: "there\'s no authentication in front of the UI or API, so don\'t expose the collector Service outside the cluster without putting your own auth in front of it."\n\nFix that. Add authentication in front of the collector\'s HTTP surface:\n\n- The JSON/query API under internal/collector/queryapi and internal/collector/ingest.\n- The server-rendered HTMX/Alpine UI under internal/collector/ui.\n\nUse a simple, self-hosted scheme appropriate for a homelab project — a token or basic-auth credential supplied via config/env, checked in middleware — not an external OAuth provider. Wire it through the same config mechanism the rest of the collector\'s settings already use. Make sure the agent-to-collector ingest path (POST /api/v1/logs) still works — that\'s service-to-service, not a browser, so it likely needs its own credential rather than sharing the UI\'s.\n\nThis repo has real test coverage and a real convention for it. Match that convention:\n\n- Add table-driven _test.go files for the new middleware/auth logic, in the same style as the existing tests in internal/collector/*.\n- Run go test ./..., make vet, and make fmt before finishing, and make sure all three are clean — don\'t declare the task done otherwise.\n- Update deploy/k8s/*.yaml and the README/config docs if the new auth setting needs to be provided at deploy time.\n\nClose with a single paragraph summarizing exactly what changed and why — that summary becomes the PR title and body verbatim.',
  stats: {
    costUsd: 1.5402,
    totalTokens: 3131220,
    turns: 84,
    toolCalls: 131,
    elapsedSeconds: 100.6,
    agentProfiles: ["ask", "coder", "reviewer"],
  },
  verification: {
    language: "go",
    builds: true,
    hasTests: true,
    testsPass: true,
  },
  decisionFlow: {
    phases: [
        {
          profile: "ask",
          agentId: "78b2ee6d",
          status: "ok",
          costUsd: 0.354,
          tokens: 660265,
          toolCalls: 93,
          judgeCalls: 5,
          judgeFlags: 0,
          why: "Survey this Go repo's collector service to prepare an auth-middleware implementa",
          topTools: [{ name: "search", count: 34 }, { name: "read_file", count: 34 }, { name: "remember", count: 18 }, { name: "list_symbols", count: 6 }, { name: "list_files", count: 1 }],
          outcome: "All facts gathered. Final briefing below.\n\nWHAT: Survey of collector service (config, HTTP wiring, ingest/queryapi/ui handlers, test conventions, k8s manifests, README) to brief an auth-middleware implementation task.\n\nPATHS:\n- cmd/collector/main.go — entrypoint: `config.Load()` → `collector.New(cfg)` → `srv.Run(ctx)`.\n- internal/collector/config/config.go — config struct + env loader.\n- internal/collector/collector.go — HTTP wiring (mux, routes, middleware pattern).\n- internal/collector/collector_test.go — test convention for middleware.\n- internal/collector/ingest/http.go, http_test.go — POST /api/v1/logs.\n- internal/collector/queryapi/http.go, http_test.go — JSON read API + health/ready.\n- internal/collector/ui/handlers.go, templates.go, templates/*.html, static/ — server-rendered UI.\n- deploy/k8s/collector-configmap.yaml, collector-deployment.yaml, collector-service.yaml.\n- README.md lines 105-119 (Deploying / Status sections).\n\nFACTS:\n\n1. Config: package `config` (internal/collector/config/config.go), pure `os.Getenv`-based, no viper/flags. `Config` struct: `HTTPAddr, DBPath string; RetentionDays, TraceWindowDays, SQLiteCacheKB, IngestChanCap, WriterFlushEvery, WriterFlushAtSi",
          leftover: "",
        },
        {
          profile: "coder",
          agentId: "369256d1",
          status: "ok",
          costUsd: 0.704,
          tokens: 1814166,
          toolCalls: 118,
          judgeCalls: 33,
          judgeFlags: 16,
          why: "Add authentication in front of the collector's HTTP surface. Repo facts (already",
          topTools: [{ name: "read_file", count: 40 }, { name: "str_replace", count: 32 }, { name: "get_diagnostics", count: 18 }, { name: "run_command", count: 12 }, { name: "remember", count: 10 }, { name: "list_files", count: 2 }],
          outcome: "All checks pass: go test ./... clean, make vet clean, make fmt clean (no files listed to reformat), go build clean, get_diagnostics clean on all edited files.\n\nWhat: Added mandatory authentication in front of the collector's HTTP surface — HTTP Basic Auth for the UI and JSON query API, and a separate bearer token for the machine-to-machine log-ingest endpoint — and wired matching credentials through Kubernetes manifests, the agent's forwarder, and docs.\n\nPaths changed:\n- internal/collector/config/config.go — added `AuthUsername`, `AuthPassword`, `IngestToken` fields, loaded via `AUTH_USERNAME`/`AUTH_PASSWORD`/`INGEST_TOKEN` env vars.\n- internal/collector/collector.go — `New()` now fails closed (returns an error) unless all three credentials are set; added `basicAuthMiddleware` and `bearerAuthMiddleware` (constant-time comparisons via `crypto/subtle`); wrapped all UI and queryapi routes in Basic Auth and the ingest POST route in bearer-token auth, applied before `route()`/`instrument()` so metrics labeling is unaffected; `/healthz`, `/readyz`, `/metrics`, `/static/` remain unauthenticated.\n- internal/collector/collector_test.go — added table-driven tests for both middlewares (missin",
          leftover: "",
        },
        {
          profile: "reviewer",
          agentId: "def12aff",
          status: "ok",
          costUsd: 0.299,
          tokens: 528231,
          toolCalls: 46,
          judgeCalls: 4,
          judgeFlags: 0,
          why: "Coder finished successfully — all checks (go test, go build, make vet, make fmt, get_diagnostics) are clean. Now let me get a review pass on this worktree before you decide merge/PR/discard.",
          topTools: [{ name: "read_file", count: 26 }, { name: "search", count: 12 }, { name: "todo_scan", count: 4 }, { name: "git_status", count: 2 }, { name: "git_diff", count: 2 }],
          outcome: "No conflicts. Everything checks out cleanly. Final check: verify Go env var precedence — envFrom (ConfigMap) is listed before env (Secret) in the container spec, and Kubernetes docs say later entries in the merged list override earlier by name, so explicit `env` overrides `envFrom`; no conflict anyway since configmap doesn't define these keys.\n\nNow finalize verdict.\n\n**Verdict: approve**\n\nSummary of review findings:\n\n- internal/collector/config/config.go:20-27,40-42 — AuthUsername/AuthPassword/IngestToken added via getEnv(\"...\", \"\") consistent with existing style.\n- internal/collector/collector.go:36-41 — New() fails closed correctly, returns descriptive errors when AuthUsername/AuthPassword/IngestToken are empty, before any resource (DB) is opened.\n- internal/collector/collector.go:60-83 — basicAuthMiddleware wraps TraceHandler, LogsHandler, FacetsHandler, Index, LogsPage, LogsResults, TraceRedirect, TraceView, QueryPage, QueryRun (all 10 expected routes). Only POST /api/v1/logs (ingest) is wrapped with bearerAuthMiddleware. /healthz (line 72), /readyz (73), /metrics (74), /static/ (83) remain registered directly on mux with no auth wrapper and no double-registration — no bypass f",
          leftover: "",
        }
    ],
    settle: { profile: "coder", action: "pr", prUrl: "https://github.com/iresharma/tracer/pull/1" },
  },
  codeReview: {
    verdict: "merge-ready",
    summary:
      "The PR delivers exactly what the task asked for: mandatory HTTP Basic Auth in front of the collector's UI and JSON query API, a separate bearer token for the machine-to-machine ingest endpoint, fail-closed config validation in collector.New(), constant-time credential comparisons, matching Secret-based wiring across the collector Deployment and agent DaemonSet, and updated README/manifest docs. Test coverage for the new middleware is thorough and table-driven in the repo's existing httptest style. The diff is tightly scoped to the auth feature with no unrelated changes. The remaining issues are minor: Basic Auth alone doesn't stop CSRF on the read-only POST /query/run endpoint, the agent's bearer-token wiring silently no-ops instead of failing fast the way the collector does, and the new forwarder test only covers the positive case.",
    findings: [
      {
        id: "code-1",
        category: "security",
        severity: "low",
        file: "internal/collector/collector.go",
        line: 79,
        summary:
          "POST /query/run is protected with HTTP Basic Auth only, which browsers auto-attach cross-origin, leaving the read-only SQL runner exposed to CSRF.",
        detail:
          "An admin who has previously authenticated to the collector in their browser (cached Basic Auth credentials for that origin) visits an unrelated malicious page while the collector is reachable (e.g. via an active kubectl port-forward or same-network access). A hidden form/fetch on that page POSTs to /query/run; the browser auto-attaches the cached Authorization header, and the collector executes the attacker-chosen SQL as the authenticated admin with no same-site/CSRF-token check.",
        suggestedFix:
          "Either require a lightweight CSRF token (double-submit cookie or hidden form field validated server-side) on POST /query/run, or restrict it to same-origin via a Sec-Fetch-Site / Origin header check, given the surrounding UI has no other CSRF defenses.",
      },
      {
        id: "code-2",
        category: "correctness",
        severity: "low",
        file: "internal/agent/forwarder/forwarder.go",
        line: 144,
        summary:
          "The agent only sets the Authorization header when IngestToken is non-empty; if it's misconfigured (unset) while the collector requires INGEST_TOKEN, the agent doesn't fail fast the way collector.New() does.",
        detail:
          "An operator rolls out the agent DaemonSet without setting INGEST_TOKEN (e.g. a typo'd Secret key or missing secretKeyRef). The agent starts successfully, silently sends unauthenticated requests, and every batch is rejected with 401 in a retry loop — the only signal is a stream of collector-side auth failures rather than a clear agent-side startup error.",
        suggestedFix:
          "Have the agent refuse to start (or log a loud warning once) when IngestToken is empty, mirroring the fail-closed pattern already used in collector.New() for AuthUsername/AuthPassword/IngestToken.",
      },
      {
        id: "code-3",
        category: "test-coverage",
        severity: "low",
        file: "internal/agent/forwarder/forwarder_test.go",
        line: 76,
        summary:
          "TestForwarderSendsBearerTokenWhenConfigured only asserts the header is sent when a token is configured; there's no companion test asserting the header is omitted when IngestToken is empty.",
        detail:
          "A future refactor of forwarder.send() could start sending an empty 'Authorization: Bearer ' header unconditionally without any test catching the regression.",
        suggestedFix: 'Add a second subtest/table row that builds the Forwarder with IngestToken: "" and asserts gotAuth == "".',
      },
    ],
  },
  processReview: {
    verdict: "efficient",
    summary:
      "The run followed a clean three-stage pipeline (ask survey → coder implementation → reviewer verification) that matches the orchestrator's own stated plan and never deviated from it. Every str_replace/create_file call in the coder trace was preceded by a read_file of that exact path, so there are zero read-before-edit violations. The coder ran go test ./..., make vet, make fmt, and go build ./... with ok:true and clean output actually visible in the tool results — not just claimed in the closing summary — directly satisfying the task's explicit 'don't declare done otherwise' requirement. write_gate judge flags fired twice on hardcoded-secret heuristics but these correspond to test-fixture literals already present in the diff, not real secrets, and the run correctly did not react to them.",
    followedNavigationHierarchy: true,
    readBeforeEditViolations: 0,
    findings: [
      {
        id: "process-1",
        category: "wasted-search",
        severity: "low",
        agentId: "78b2ee6d",
        profile: "ask",
        summary:
          "The ask agent ran four overlapping searches against internal/collector/ui in quick succession instead of one targeted pass.",
        detail:
          "A broad listing search against internal/collector/ui was immediately followed by three narrower searches (template/embed patterns, a .go$ filename search, and a ^package ui search) against the same path — the first broad search already would have surfaced the .go files and package declaration the latter two re-derived.",
      },
      {
        id: "process-2",
        category: "judge-flag",
        severity: "low",
        agentId: "369256d1",
        profile: "coder",
        summary:
          "write_gate's introduces_hardcoded_secret heuristic scored 0.92 on the diff snapshot after an agent.go edit, but this was a false positive from test literals added earlier in collector_test.go, and the run correctly did not react to it.",
        detail:
          "The flagged edit contains no string literals at all — the flag is attributable to the cumulative working-tree diff already containing test credential strings from earlier collector_test.go edits. Since the gate was unenforced (advisory only), the coder proceeded without pausing or backing off.",
      },
    ],
  },
  overallAssessment: {
    recommendation: "merge",
    narrative:
      "This is a solid, well-scoped implementation that matches the task's explicit constraints (self-hosted scheme, not OAuth, wired through the existing env-based config mechanism, ingest kept separate from UI/API auth) and passed a genuine reviewer pass that verified real facts about the diff rather than rubber-stamping. The process was efficient and disciplined — research, then implementation, then verification, each stage handing concrete facts to the next, with no wasted rework and full read-before-edit compliance. The only gaps worth raising before merge are minor hardening items (CSRF on the query runner, fail-fast agent config, one missing negative test) that don't block shipping the fix for the README's stated auth gap.",
    strengths: [
      "Fail-closed collector startup (refuses to run without AUTH_USERNAME/AUTH_PASSWORD/INGEST_TOKEN) rather than silently running unauthenticated.",
      "Constant-time credential comparisons (crypto/subtle) for both Basic Auth and bearer token checks.",
      "Correct separation of human-facing Basic Auth vs. machine-facing bearer token, matching the task's explicit guidance.",
      "Test coverage matches the repo's existing table-driven httptest convention, including an end-to-end mux-level test.",
      "go test ./..., make vet, make fmt, and go build ./... were all actually run and shown clean in the trace, not just asserted in the summary.",
      "Zero read-before-edit violations across all 16 str_replace and 1 create_file calls.",
      "Tight scope: only files needed for the auth feature were touched, with k8s manifests, agent wiring, and README all updated consistently.",
    ],
    concerns: [
      "POST /query/run has no CSRF protection beyond Basic Auth, which browsers will auto-attach cross-origin.",
      "Agent-side ingest token is soft-fail (silently omits header) rather than fail-fast like the collector, so a misconfigured token only surfaces as ongoing 401s.",
      "New forwarder test only covers the token-present case, not the token-absent case.",
    ],
  },
  links: {
    prUrl: "https://github.com/iresharma/tracer/pull/1",
    repoUrl: "https://github.com/iresharma/tracer",
    diffUrl: "https://github.com/iresharma/tracer/pull/1.diff",
  },
};
