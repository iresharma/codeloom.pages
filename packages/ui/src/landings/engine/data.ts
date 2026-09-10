export const commands = [
  { name: "StartSession", meaning: "Bind a workspace, resume from SQLite, boot language servers." },
  { name: "ListSessions", meaning: "Stored sessions, newest first." },
  { name: "SubmitUserMessage", meaning: "One orchestrator turn. Queues if it's already answering." },
  { name: "RequestSnapshot", meaning: "Reconnect payload — history, files, tree, git." },
  { name: "RequestOrchContext", meaning: "The orchestrator's live model context." },
  { name: "OpenFile / CloseFile", meaning: "Drive the file panel. Marks a file read for the funnel." },
  { name: "RequestGit", meaning: "Branch, dirty, staged / unstaged / untracked." },
  { name: "UndoLastEdit", meaning: "Reverts the last batch. SHA-verified." },
  { name: "AbortAgent", meaning: "Cancel the orchestrator's reply, or one subagent by id." },
  { name: "AnswerPrompt", meaning: "Approve a command, or settle a worktree." },
  { name: "Shutdown", meaning: "Persist, kill children, drop worktrees, stop servers." },
];

export const toolFamilies = [
  { label: "Navigation", value: 3, hint: "list_files · read_file · search" },
  { label: "Tree-sitter", value: 5, hint: "symbols · queries · syntax trees" },
  { label: "Language server", value: 6, hint: "definitions · references · rename" },
  { label: "Text editing", value: 4, hint: "replace · insert · create" },
  { label: "Structural editing", value: 3, hint: "symbol-scoped · patch" },
  { label: "Execution", value: 1, hint: "run_command" },
  { label: "History", value: 2, hint: "undo · list edits" },
  { label: "Git", value: 2, hint: "status · diff, read-only" },
  { label: "Web", value: 2, hint: "fetch · search" },
  { label: "Browser", value: 4, hint: "console · screenshot · network" },
];

export const loop = [
  { k: "01", label: "bind", v: "One socket. One workspace. One process owns it." },
  { k: "02", label: "command", v: "12 verbs in — start, edit, git, abort, more." },
  { k: "03", label: "event", v: "27 verbs out. Every client sees the same stream." },
];

export const lanes = [
  {
    id: "fast",
    label: "Tools",
    sub: "for the model",
    body: "A bet the model takes alone. Drop a file, decorate a function, restart. Cheap to add, cheap to be wrong.",
  },
  {
    id: "slow",
    label: "Commands & events",
    sub: "for the client",
    body: "A promise every client depends on. Reviewed before it ships — the wire only grows by agreement.",
  },
] as const;

export const extendStats = [
  { label: "decorator away", value: 1, suffix: "", hint: "@tool, restart, done" },
  { label: "files own the wire", value: 2, suffix: "", hint: "commands.py + events.py" },
  { label: "registries touched", value: 0, suffix: "", hint: "the loop just imports" },
];

export const readTiers = [
  {
    label: "grep",
    cost: "~0ms · this file only",
    body: "search and read_file. Free, but it doesn't know a symbol from a string — burns context reading whole files to find one function.",
    tools: ["list_files", "read_file", "search"],
  },
  {
    label: "tree-sitter",
    cost: "~0ms · this file only",
    body: "Parses one file, no server, no warm-up. find_symbol returns the definition and its exact coordinate — the handoff into the LSP tools. Doesn't know what the file imports.",
    tools: ["list_symbols", "find_symbol", "get_node_at", "query_tree", "parse_file"],
  },
  {
    label: "language server",
    cost: "seconds · whole workspace",
    body: "Warm start indexes up to 500 files before the first question. Answers where a symbol actually comes from and who calls it — real types, not guesses.",
    tools: ["goto_definition", "find_references", "hover", "get_diagnostics", "document_symbols", "rename_symbol"],
  },
];

export const stages = [
  { label: "read", body: "Unread files can't be edited. Full stop." },
  { label: "guard", body: "No symlinks, no escapes, no lockfiles, no secrets." },
  { label: "id", body: "SHA-verified against the last read. No stale writes." },
  { label: "syntax", body: "Re-parsed with tree-sitter. New errors get rejected." },
  { label: "write", body: "Atomic. A batch lands whole, or not at all." },
  { label: "undo", body: "Full before/after bytes, journaled, re-verified." },
];

export const personas = [
  { name: "ask", role: "reads", worktree: "main workspace", body: "Answers \"how does this work.\" Can't edit, can't run." },
  { name: "coder", role: "writes", worktree: "isolated worktree", body: "Takes a brief, edits the files. Must check its own diagnostics." },
  { name: "tester", role: "proves", worktree: "isolated worktree", body: "Tests only, never production code. Must run something." },
  { name: "researcher", role: "fetches", worktree: "main workspace", body: "Web search and fetch. Cites its sources." },
  { name: "debugger", role: "hunts", worktree: "main workspace", body: "Logs, LSP, a headless browser. Finds it, doesn't fix it." },
  { name: "reviewer", role: "judges", worktree: "joins the writer", body: "Approve, request changes, or block. Never merges." },
];

export const agentStats = [
  { label: "personas", value: 6, suffix: "", hint: "ask · coder · tester · researcher · debugger · reviewer" },
  { label: "concurrent", value: 8, suffix: "", hint: "max spawns per turn" },
  { label: "token budget", value: 120000, suffix: "", hint: "compaction at 70%" },
];

export const settleChoices = [
  { id: "merge", label: "merge", body: "Commits, then lands on your branch." },
  { id: "pr", label: "open a PR", body: "gh pr create. Link back in chat." },
  { id: "keep", label: "keep", body: "Branch stays. Merge it yourself." },
  { id: "discard", label: "discard", body: "Gone. Empty ones vanish with no prompt." },
];

export const foldStats = [
  { label: "raw trail", value: 30, suffix: "+", hint: "thinking, calls, results" },
  { label: "folded to", value: 3, suffix: "", hint: "status, summary, files touched" },
  { label: "reaches you", value: 0, suffix: "", hint: "of the child's raw tokens" },
];

export const extendPoints = [
  {
    title: "A subagent",
    body: "A module in agents/profiles/. The orchestrator sees it as a spawn tool automatically.",
    code: `# agents/profiles/auditor.py
PROFILE = AgentProfile(
    name="auditor",
    system_prompt=AUDITOR_SYSTEM,
    tool_names=NAV + SITTER,
)`,
  },
  {
    title: "A transport",
    body: "EngineServer only ever calls three methods on a session. WebSocket or HTTP needs no core changes.",
    code: `session.subscribe(client)
await session.handle(command)
session.unsubscribe(client)`,
  },
  {
    title: "A model",
    body: "AgentLoop needs one method. Implement it and swap out OpenRouter.",
    code: `class MyProvider:
    async def complete(self, messages, tools=None) -> LLMResult:
        ...`,
  },
];

export const shipped = [
  "32 tools, ten families — including web and a browser",
  "A write funnel: identity, syntax gate, atomic commit, undo",
  "6 subagents, isolated worktrees, up to 8 at once",
  "Merge / PR / keep / discard — always your call",
  "Context compaction, memory across sessions",
  "Real language servers for Python, Go, JS, TS",
];

export const knownLimits = [
  "Free to run for dev and eval. Production needs a license.",
  "Deep tooling covers 4 languages. 14 more are detected only.",
  "Browser tools need Playwright installed.",
];
