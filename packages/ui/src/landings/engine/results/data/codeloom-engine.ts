import type { EngineResultReport } from "../types";

export const codeloomEngineReport: EngineResultReport = {
  slug: "codeloom-engine",
  repo: "iresharma/codeloom.engine",
  prUrl: "https://github.com/iresharma/codeloom.engine/pull/41",
  prNumber: 41,
  runStatus: "ok",
  taskTitle: "HTTP hardening + binary packaging investigation",
  taskSummary:
    "Two-part task, one PR: (A) harden the http_request tool against timeouts, TLS/DNS failures, redirect loops, and connection resets, with retry-with-backoff for idempotent methods only; (B) investigate packaging the engine as a single deployable binary — pick a tool, produce a working prototype build, and document what does not survive naive bundling (tree-sitter grammars, npx-spawned language servers, gopls, Playwright browsers).",
  taskPrompt:
    "This repo is the engine you are currently running as — you are being asked to improve your own codebase. This is a two-part task; land it as a single PR.\n\nPart A — robust HTTP/HTTPS error handling. Harden the http_request tool against connection/read timeouts, TLS/certificate errors, redirect loops, connection resets/DNS failures, and retry with backoff for transient failures — never retrying non-idempotent methods or 4xx responses. Every failure mode should degrade to a clear `error: ...` string. Add or extend tests, mocking the transport rather than hitting the real network.\n\nPart B — investigate packaging the engine as a deployable binary (PyInstaller, Nuitka, or shiv/zipapp). Scope realistically: produce a working build for the core server + client path, checked in as a re-runnable build script, plus a short doc on what does not survive naive bundling and why (tree-sitter grammars, npx-spawned language servers, gopls, Playwright browsers) and what a full solution would require.\n\nClose with a single paragraph summarizing exactly what changed in both parts — that summary becomes the PR title and body verbatim.",
  stats: {
    costUsd: 3.2479,
    totalTokens: 5021181,
    turns: 138,
    toolCalls: 188,
    elapsedSeconds: 151.6,
    agentProfiles: ["researcher", "ask", "coder", "coder", "reviewer"],
  },
  verification: {
    language: "python",
    builds: true,
    hasTests: true,
    testsPass: true,
  },
  decisionFlow: {
    phases: [
        {
          profile: "ask",
          agentId: "604e6843",
          status: "ok",
          costUsd: 0.327,
          tokens: 503294,
          toolCalls: 95,
          judgeCalls: 7,
          judgeFlags: 0,
          why: "Survey this repo (the engine codebase) to prepare for two changes.",
          topTools: [{ name: "search", count: 44 }, { name: "read_file", count: 32 }, { name: "remember", count: 18 }, { name: "list_files", count: 1 }],
          outcome: "what: Survey of engine repo for http_request tool conventions, tests, entry points, deps, and subprocess/native-binary risk points (tree-sitter, npx/pyright/tsserver, gopls, playwright), ahead of packaging/refactor work.",
          leftover: "None from source inspection — all requested files/behaviors were found and read directly. If the coder needs to know how `npx -y` behaves in a fully offline/no-network single-binary deployment (whether it fails loudly or hangs), that's a runtime/environment characteristic of `npx` itself, not something visible in this codebase; would need an actual sandboxed run to observe (out of scope for static read-only survey).",
        },
        {
          profile: "researcher",
          agentId: "faaf8290",
          status: "ok",
          costUsd: 0.345,
          tokens: 474676,
          toolCalls: 44,
          judgeCalls: 0,
          judgeFlags: 0,
          why: "We need to package a Python 3 project (a CLI/server engine run via `python app.p",
          topTools: [{ name: "web_fetch", count: 22 }, { name: "pkg_info", count: 6 }, { name: "github_repo", count: 6 }, { name: "web_search", count: 4 }, { name: "github_search_code", count: 4 }, { name: "remember", count: 2 }],
          outcome: "what: Compare PyInstaller, Nuitka, and shiv/zipapp for packaging a Python 3 CLI/server (`app.py`) + headless client (`dummy_client.py`) into a deployable binary, given deps (requests/httpx, maybe Flask, tree-sitter bindings, subprocess calls to `npx`/`node`/Playwright browser), and recommend one for a first prototype covering just the core server+client path.",
          leftover: "Did not test actual builds (no execution tooling available in this role) — a coder should validate: (a) whether Flask (if used) needs its own PyInstaller hook (it's well-supported but confirm version), (b) exact hidden-import list once tree-sitter's Python bindings + specific grammar packages are chosen (tree-sitter grammars are typically prebuilt `.so`/`.dll` per-language packages — will likely need `--collect-all` or explicit `binaries=` entries per grammar), (c) Playwright's browser binaries are downloaded separately via `playwright install` to a cache dir, not part of pip wheels — packagin",
        },
        {
          profile: "coder",
          agentId: "05c7ac0e",
          status: "ok",
          costUsd: 1.244,
          tokens: 1565033,
          toolCalls: 84,
          judgeCalls: 25,
          judgeFlags: 10,
          why: "Both investigations are in. Now spawning a single coder to do Part A first (hardening `http_request`); Part B will continue in the same worktree afterward so everything lands as one branch/PR.",
          topTools: [{ name: "read_file", count: 28 }, { name: "run_command", count: 18 }, { name: "str_replace", count: 12 }, { name: "search", count: 10 }, { name: "get_diagnostics", count: 8 }, { name: "insert_at_line", count: 2 }],
          outcome: "what: Hardened `runtime/tools/httpx.py`'s HTTP primitive against timeouts, TLS/cert errors, DNS failures, connection resets, and redirect loops, and added idempotent-only retry-with-backoff for transient failures; extended `tools/http.py`'s public `http_request` with an optional `max_retries` passthrough; extended `tests/test_httpx_coverage.py` with a new `TestHardening` class plus fixed two existing tests whose exact error strings changed.",
          leftover: "None outstanding for this task. Did not touch `runtime/tools/lsp.py`, `sitter.py`, `browser.py`, or packaging files per instructions. Did not add a `connect_timeout` param distinct from `timeout` to `tools/http.py`'s tool wrapper — stdlib urllib has no true connect/read split, so the single `timeout` knob is documented in `raw_request`'s docstring as covering both; if a later task wants per-phase timeouts it would require switching off stdlib `urllib` (out of scope, module intentionally stays pure-stdlib per the briefing).",
        },
        {
          profile: "coder",
          agentId: "683094d6",
          status: "ok",
          costUsd: 0.463,
          tokens: 1137531,
          toolCalls: 76,
          judgeCalls: 19,
          judgeFlags: 11,
          why: "Part A complete and tests pass (92/92). Now continuing in the same worktree for Part B — the packaging investigation/build script/doc.",
          topTools: [{ name: "run_command", count: 32 }, { name: "read_file", count: 16 }, { name: "search", count: 6 }, { name: "get_diagnostics", count: 6 }, { name: "create_file", count: 4 }, { name: "str_replace", count: 4 }],
          outcome: "what: Implemented Part B — a PyInstaller-based single-binary packaging prototype for the engine, plus a doc investigating four native-process bundling trouble spots.",
          leftover: "The four trouble spots (tree-sitter grammar bundling via --collect-all + empirical per-language parse test against the frozen binary; LD_LIBRARY_PATH sanitization before Popen in LSPClient.__init__ for npx/gopls; Playwright bundle-vs-document decision for the Chromium cache dir) are documented in docs/packaging.md but deliberately not implemented — explicitly scoped as follow-up work per the task. --onefile mode also deferred per the task's instruction.",
        },
        {
          profile: "reviewer",
          agentId: "43fded62",
          status: "ok",
          costUsd: 0.461,
          tokens: 1072634,
          toolCalls: 68,
          judgeCalls: 5,
          judgeFlags: 0,
          why: "Both parts are done in the same worktree, and the packaging build was actually executed and smoke-tested (not just claimed). Let me get a reviewer verdict on the combined diff before asking you to merge/PR.",
          topTools: [{ name: "read_file", count: 28 }, { name: "search", count: 28 }, { name: "todo_scan", count: 8 }, { name: "git_status", count: 2 }, { name: "git_diff", count: 2 }],
          outcome: "Review complete. Verdict: approve.",
          leftover: "none blocking. Optional follow-up (non-blocking): remove the dead `err == \"error: fetch timed out\"` fallback in httpx.py:209, and/or add one test that actually drives `_SafeRedirect.redirect_request` through >MAX_REDIRECTS hops rather than only mocking the resulting URLError string.",
        }
    ],
    settle: { profile: "coder", action: "pr", prUrl: "https://github.com/iresharma/codeloom.engine/pull/41" },
  },
  codeReview: {
    verdict: "needs-changes",
    summary:
      "The HTTP-hardening change in runtime/tools/httpx.py is well-designed: the retry loop correctly gates on IDEMPOTENT_METHODS, the redirect-depth cap in _SafeRedirect.redirect_request() correctly fires before urllib's own built-in max_repeats/max_redirections check (verified by reading CPython's HTTPRedirectHandler.http_error_302 source), and every exception path still degrades to a plain 'error: ...' string. 13 new tests were added and the suite was actually run (exit code 0). The packaging prototype is honestly scoped and the investigation doc is well-cited against real file:line references. The two real gaps are a medium-severity test-coverage hole and a small piece of dead code the run's own reviewer already flagged but that was never cleaned up before merge.",
    findings: [
      {
        id: "code-1",
        category: "test-coverage",
        severity: "medium",
        file: "tests/test_httpx_coverage.py",
        line: 826,
        summary:
          "The new redirect-loop-cap logic (_SafeRedirect.redirect_request()'s depth counter and MAX_REDIRECTS comparison) is never actually exercised by any test.",
        detail:
          "test_redirect_loop_detected monkeypatches http_impl.urlopen to directly raise urllib.error.URLError('too many redirects') rather than driving a real (or fake) chain of 302 responses through _SafeRedirect.redirect_request(). If the depth-counting logic itself has a bug (off-by-one, attribute not propagating across hops, wrong comparison operator), no test in this suite would catch it — the suite only proves that if that string is produced, it gets classified correctly by _classify_url_error. All 3 new redirect-related tests in TestHardening have this same gap.",
        suggestedFix:
          "Add a test that calls _SafeRedirect().redirect_request() directly in a loop (or builds a minimal fake urllib opener chain) to prove the cap actually fires at hop 6 and not at hop 4 or 10, exercising the real interaction with urllib's own max_repeats/max_redirections rather than only the downstream error-string mapping.",
      },
      {
        id: "code-2",
        category: "simplification",
        severity: "low",
        file: "runtime/tools/httpx.py",
        line: 206,
        summary:
          "raw_request()'s retry-decision line contains a dead disjunct comparing against an error string that can no longer be produced.",
        detail:
          'is_timeout = err.startswith("error: request timed out") or err == "error: fetch timed out" — the second clause matches the pre-PR timeout message, which _do_request no longer emits (it always returns f"error: request timed out after {timeout:g}s" now). The clause is unreachable and was already called out as a non-blocking nit by this run\'s own reviewer agent, but was never removed before the PR was opened.',
        suggestedFix: 'Delete the `or err == "error: fetch timed out"` clause.',
      },
      {
        id: "code-3",
        category: "style",
        severity: "low",
        file: "scripts/build_binary.sh",
        line: 25,
        summary:
          "The build script installs an unpinned pyinstaller version, undermining the script's stated re-runnability/reproducibility goal.",
        detail:
          "Running scripts/build_binary.sh six months from now silently picks up a newer PyInstaller major version with potentially different bundling/hook behavior than the 6.22.3 that was actually verified and documented in docs/packaging.md, so a 'known good' build script can quietly stop matching its own documentation.",
        suggestedFix:
          "Pin pyinstaller==6.22.3 (or the version range actually tested) in the pip install line, or add a one-line comment explaining that it's intentionally left floating and why.",
      },
    ],
  },
  processReview: {
    verdict: "acceptable",
    summary:
      "Navigation was efficient throughout: sub-agents used targeted search + read_file rather than reaching for expensive LSP tools the task never needed, prior research was captured via remember and handed to the coder agents instead of being re-derived, and the one read-before-edit violation was caught by the tool and recovered in the very next call. Sandbox guardrails blocked three run_command attempts and the agent adapted each time without thrashing. The two real process problems are: the final PR's title/body that actually landed on GitHub does not match the two-part summary the orchestrator drafted and showed the user, and a specific '92 passed' test count was asserted and propagated without ever appearing in the truncated tool output the agent actually received.",
    followedNavigationHierarchy: true,
    readBeforeEditViolations: 1,
    findings: [
      {
        id: "process-1",
        category: "reasoning-gap",
        severity: "high",
        agentId: "683094d6",
        profile: "orchestrator",
        summary:
          "The PR actually opened on GitHub does not contain the two-part summary paragraph task.md explicitly required, and instead uses a truncated, Part-B-only auto-generated report as the title and body.",
        detail:
          "task.md required the closing paragraph to become the PR title/body verbatim. The orchestrator's chat reply showed a well-formed two-part paragraph and said 'here's the PR description ready to use verbatim' — but the merged PR title is cut off mid-word and the body is the raw Part-B coder's self-report, never mentioning Part A. No gh pr create-style record appears in the tool trace, so the substitution happened at an orchestration layer outside the visible trace.",
      },
      {
        id: "process-2",
        category: "reasoning-gap",
        severity: "medium",
        agentId: "05c7ac0e",
        profile: "coder",
        summary:
          "The coder's claim of '92 passed, 0 failed' is not backed by any visible tool output — the only pytest run's captured result was truncated before reaching the summary line.",
        detail:
          "The pytest run's result field (4018 chars) cuts off mid-list well before any 'X passed in Ys' summary line, yet the agent's finish report states '92 passed, 0 failed'. Exit code 0 does support 'no failures', but the specific count of 92 was never observed in this trace.",
      },
      {
        id: "process-3",
        category: "missed-tests",
        severity: "low",
        agentId: "43fded62",
        profile: "reviewer",
        summary:
          "The reviewer agent approved the PR using only static reading and never independently re-ran the test suite.",
        detail:
          "The reviewer's tool calls were limited to git_status, git_diff, read_file (x14), search (x14), and todo_scan (x4) — no run_command entry anywhere in its trace. The approval implicitly trusted the coder's self-reported '92 passed, 0 failed' rather than re-executing pytest, which would have been cheap and would have caught the unverified count.",
      },
      {
        id: "process-4",
        category: "judge-flag",
        severity: "low",
        agentId: "05c7ac0e",
        profile: "coder",
        summary:
          "write_gate judge flagged several genuinely correct, small test/source edits as 'may not accomplish what was asked'; all were unenforced and the run correctly ignored them without any corrective thrashing.",
        detail:
          "All 7 write_gate decisions in this run were enforced=false (advisory only). The flags landed on trivial, correct diffs — e.g. adding a monkeypatch to an existing test, or adding an import. The agent did not react to these flags, which was the right call since they were false positives.",
      },
      {
        id: "process-5",
        category: "redundant-tool-call",
        severity: "low",
        agentId: "683094d6",
        profile: "coder",
        summary:
          "Three consecutive get_diagnostics calls on a .sh, .md, and .gitignore file all failed with 'No LSP server configured for extension X', a guaranteed-to-fail check given none of those file types can have LSP diagnostics.",
        detail:
          "Low-cost (3-4ms each) but three calls that could not possibly have returned a result — scripts/build_binary.sh, docs/packaging.md, and .gitignore each returned the same 'no LSP server configured' error.",
      },
      {
        id: "process-6",
        category: "reasoning-gap",
        severity: "low",
        agentId: "683094d6",
        profile: "coder",
        summary:
          "A str_replace on .gitignore was attempted before the file had been read in this agent's own context, was rejected by the read-before-edit guard, and was correctly recovered one call later.",
        detail:
          "str_replace on .gitignore returned 'error: read .gitignore before editing it'. The very next call was read_file on .gitignore, followed immediately by the same str_replace succeeding — a recovered violation, not a stalled one.",
      },
    ],
  },
  overallAssessment: {
    recommendation: "request-changes",
    narrative:
      "The engineering substance of this run is solid: the HTTP-hardening diff is correct on careful inspection, including a subtle urllib interaction that could easily have been gotten wrong. The packaging investigation is genuinely researched rather than assumed, and the multi-agent process navigated the repo efficiently with sensible guardrail handling throughout. What drags this down is the tail end of the pipeline: the actual PR title and body delivered to the user does not match what the task asked for or what the orchestrator told the user it would use, and the chain of trust from 'truncated tool output' to 'coder's specific pass count' to 'reviewer's approval without re-running tests' has no independent verification step. None of this affects the shipped code's correctness, but the PR as opened would need a manual title/body fix and one more test before a human reviewer should merge it as-is.",
    strengths: [
      "The core hardening logic — timeout classification, TLS/DNS/reset-specific error strings, retry-with-backoff gated on idempotent methods and non-5xx-only, and the redirect-depth cap — is correct, including a non-obvious interaction with urllib's own loop detection that was verified to work as intended.",
      "Efficient multi-agent navigation: research and repo-survey facts were captured once via `remember` and handed forward to coder agents instead of being re-derived; tool usage favored cheap search/read_file over expensive LSP tools the task never required.",
      "Sandbox guardrail rejections (three run_command blocks) were handled gracefully with no thrashing or forced retries.",
      "Part B's packaging investigation doc is honestly scoped, with every file:line claim spot-checked by both the coder and a separate reviewer agent against live source.",
      "Actual pytest run happened (not just claimed) with exit code 0, and a real PyInstaller build was executed and smoke-tested end-to-end, not merely described.",
    ],
    concerns: [
      "The PR that actually landed on GitHub does not satisfy the task's explicit instruction to close with a two-part paragraph that becomes the PR title/body verbatim — the real title is truncated mid-word and the real body only describes Part B.",
      "The specific '92 passed' test count reported by the coder and repeated in the unused drafted PR description is not backed by any visible tool output in the trace.",
      "The reviewer agent approved the PR without independently re-running the test suite, relying entirely on static diff/file reading.",
      "The new redirect-loop cap — the specific mechanism requested for 'redirect handling (including redirect loops)' — has no test that exercises its actual depth-counting logic end-to-end, only its downstream error-string formatting.",
    ],
  },
  links: {
    prUrl: "https://github.com/iresharma/codeloom.engine/pull/41",
    repoUrl: "https://github.com/iresharma/codeloom.engine",
    diffUrl: "https://github.com/iresharma/codeloom.engine/pull/41.diff",
  },
};
