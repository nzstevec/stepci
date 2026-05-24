## Why

Analytics is currently opt-out via `STEPCI_DISABLE_ANALYTICS`, which surprises users who expect privacy-safe defaults, and causes network timeout failures in offline environments. The `run` command also lacks a way to target a single named test from a multi-test workflow, making it awkward to iterate during development. Finally, there is no way to emit informational messages from within a workflow without encoding them as side-effects of HTTP responses.

## What Changes

- **BREAKING**: Analytics is now opt-in. Events are only sent when `STEPCI_ENABLE_ANALYTICS` is set. The existing `STEPCI_DISABLE_ANALYTICS` variable is removed.
- `stepci run` accepts a new optional `--test <name>` flag. When supplied, only the steps under `tests.<name>` are executed; all other tests are skipped.
- When `--test` is omitted, all named tests in the workflow are executed (existing behaviour).
- Workflows support a new `log` step field. When present, the associated string value is printed to stdout during execution before the step's HTTP request (if any).

## Capabilities

### New Capabilities

- `analytics-opt-in`: Analytics events are gated on `STEPCI_ENABLE_ANALYTICS` rather than suppressed by `STEPCI_DISABLE_ANALYTICS`.
- `run-test-filter`: `stepci run` accepts `--test <name>` to execute a single named test from the workflow.
- `workflow-log`: Workflow steps support a `log` field whose string value is printed to stdout during execution.

### Modified Capabilities

- `capture-json-update`: No requirement change.

## Impact

- `src/lib/analytics.ts`: env variable guard logic inverted.
- `src/lib/render.ts`: analytics message updated to reflect opt-in wording.
- `src/index.ts`: `run` command option definition and `runFromFile` call to pass test filter; `log` field rendering.
- Runner `runFromFile` / `runFromYAML` API: must accept and honour a `tests` filter option.
- Workflow schema and `docs/reference/workflow-syntax.md`: document `log` field.
- Docs `docs/reference/cli.md`: document `--test` flag and analytics opt-in change.
