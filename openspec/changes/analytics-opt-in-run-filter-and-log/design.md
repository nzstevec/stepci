## Context

StepCI currently sends analytics on every run unless `STEPCI_DISABLE_ANALYTICS` is set. The `run` command executes all tests in a workflow with no way to target a single named test. Workflows have no mechanism to emit informational messages during execution.

All three changes touch `src/index.ts` as the CLI entry point, with the analytics change also touching `src/lib/analytics.ts` and the `log` field requiring a runner-side contract for step-level output.

## Goals / Non-Goals

**Goals:**
- Invert the analytics guard so events are sent only when `STEPCI_ENABLE_ANALYTICS` is set.
- Add a `--test <name>` option to `stepci run` that restricts execution to a single named test.
- Add a `log` field to workflow steps that emits a string to stdout before the step executes.

**Non-Goals:**
- Changing the analytics payload shape or destination.
- Supporting multiple `--test` flags or glob patterns for test name matching.
- Structured/machine-readable log output (plain stdout only).
- Migrating existing users who set `STEPCI_DISABLE_ANALYTICS` (breaking change, documented in proposal).

## Decisions

### Analytics: opt-in guard

Replace `if (!process.env.STEPCI_DISABLE_ANALYTICS)` with `if (process.env.STEPCI_ENABLE_ANALYTICS)` in both `analytics.ts` (event send) and `render.ts` (advisory message). Remove all references to `STEPCI_DISABLE_ANALYTICS`.

*Why*: Opt-in is safer for offline environments and meets privacy-first expectations without requiring any configuration from the majority of users.

*Alternative considered*: Keep opt-out, change the default message. Rejected because it still fires network calls in restricted environments.

### Run test filter: CLI option + runner pass-through

Add `.option('test', { type: 'string', alias: 't', describe: 'run only this named test' })` to the `run` command. Pass the value as a `tests` property on the options object supplied to `runFromFile` / `runFromYAML`. The runner is responsible for filtering; the CLI passes the value through.

*Why*: Keeps filtering logic in the runner where test lifecycle is managed, consistent with how `env` and `secrets` are already passed.

*Alternative considered*: Filter in the CLI by reading the YAML before calling the runner. Rejected because it duplicates workflow-parsing logic that belongs in the runner.

### Workflow log field: step-level string output

The runner emits the `log` value to stdout before executing a step. The CLI receives it via an existing or new event (e.g. `step:log`) and writes it with `console.log`. No formatting is applied; the raw string is written as-is.

*Why*: Step-level output is within the runner's execution domain. A dedicated event keeps rendering concerns in the CLI.

*Alternative considered*: Have the runner write directly to stdout. Rejected because it bypasses the CLI rendering layer and makes output harder to test or suppress.

## Risks / Trade-offs

- **Breaking change on analytics**: Users who relied on `STEPCI_DISABLE_ANALYTICS=1` to suppress network calls must now remove that variable and not set `STEPCI_ENABLE_ANALYTICS`. They will silently stop receiving the advisory message (acceptable—they were already opting out).
  → Mitigation: Document clearly in release notes. The advisory message only appears when analytics is enabled.

- **Runner API change required**: `--test` filter requires the runner to accept and honour a `tests` option. This is a cross-repo change.
  → Mitigation: The runner change is tracked separately. Until the runner is updated, `--test` is accepted by the CLI but silently ignored; document this limitation.

- **Log field schema addition**: Adding `log` to the step schema may surface validation warnings in editors using the existing JSON schema.
  → Mitigation: Update `schema.json` as part of this change via the existing `postbuild` script.

## Open Questions

- Should `--test` fail explicitly when the named test does not exist in the workflow, or run with zero steps? (Proposed: fail with an actionable error.)
- Should `log` support template expressions (e.g. `${{captures.id}}`)? (Proposed: yes, rendered through the same template engine as other string fields.)
