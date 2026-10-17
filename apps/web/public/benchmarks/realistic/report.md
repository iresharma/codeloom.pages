# CodeLoom benchmark — realistic

Status: complete. 15 tasks; no repeated trials or ablations.

Generator: deepseek/deepseek-v4-pro-0813 / baidu/fp8; classifier off.

| System | Pass / evaluable | Cost | Cost / success |
| --- | --- | --- | --- |
| mini-swe-agent | 10 / 15 | $1.5616 | $0.1562 |
| engine-core | 14 / 15 | $6.6975 | $0.4784 |

Paired outcomes: engine_only: 5; mini_only: 1; both_pass: 9; both_fail: 0; unresolved: 0; unrun: 0

## Limitations

- Author-designed corpus; no independent review.
- One run per task; no reliability, interaction, or component-effect claims.
- Realistic tasks add browser, terminal and research evidence on top of hidden checks.
- Live research results can change between runs.
- Host ARM64 runs Linux AMD64 through emulation.
- Offline report rebuilding is reproducible; model outputs, endpoint availability and prices are not.
