# CodeLoom benchmark — railway-v1-restart-20261015

Status: complete. 9 tasks; no repeated trials or ablations.

Generator: deepseek/deepseek-v4-pro-0813 / baidu/fp8; classifier off.

| System | Pass / evaluable | Delivered / scheduled | Cost | Cost / success |
| --- | --- | --- | --- | --- |
| mini-swe-agent | 8 / 9 | 8 / 9 | $0.2710 | $0.0339 |
| engine-core | 8 / 9 | 8 / 9 | $2.4453 | $0.3057 |

Paired outcomes: engine_only: 0; mini_only: 0; both_pass: 8; both_fail: 1; unresolved: 0; unrun: 0

## Observations from traces

This is a whole-system comparison with no ablations. These observations describe runs and cannot isolate a component's effect.

- mini-swe-agent: 0 budget stops, 0 call estimate stops, 0 watchdog stops, 0 newly failing trusted check commands.
- engine-core: 2 budget stops, 0 call estimate stops, 0 watchdog stops, 0 newly failing trusted check commands.
- Example pass (mini-swe-agent, first by task ID): [tinydb-B](trials/railway-v1-restart-20261015-tinydb-B-mini-swe-agent/result.json), termination `completed`. Its directory retains patch, native trace and verification evidence.
- Example fail (mini-swe-agent, first by task ID): [chi-N](trials/railway-v1-restart-20261015-chi-N-mini-swe-agent/result.json), termination `completed`. Its directory retains patch, native trace and verification evidence.
- Example pass (engine-core, first by task ID): [tinydb-B](trials/railway-v1-restart-20261015-tinydb-B-engine-core/result.json), termination `completed`. Its directory retains patch, native trace and verification evidence.
- Example fail (engine-core, first by task ID): [chi-N](trials/railway-v1-restart-20261015-chi-N-engine-core/result.json), termination `completed`. Its directory retains patch, native trace and verification evidence.

## Limitations

- Author-designed corpus; no independent review.
- One run per task; no reliability, interaction, or component-effect claims.
- Synthetic bugs keep upstream tests, which can reveal the regression.
- Test-generation features are supplied with their reference tests withheld.
- Offline report rebuilding is reproducible; model outputs, endpoint availability and prices are not.
- Owner waived fresh paid calibration and redundant compatibility probes. Historical request timing and existing adapter tests are accepted; the current runtime has not passed a fresh end-to-end calibration. Fixture certification remains required.

Billing correction: [settled ledger reconciliation](cost-reconciliation.json). The HTTP 504 reservation was already settled at zero in the campaign ledger; published costs now reflect that settlement.
