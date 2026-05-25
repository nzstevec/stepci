## Why

Users need unambiguous behavior for `stepci run` when `--test` is omitted, and the CLI help/docs need to reflect the new filter option accurately. Documentation for capture update and workflow `log` also needs to be explicit so users can adopt these capabilities without reading source code.

## What Changes

- Clarify and enforce that `stepci run` executes all named tests when `--test` is not provided.
- Update CLI help text to describe the `--test` parameter and default behavior.
- Update docs to describe capture `update` semantics and step-level `log` usage with examples.
- Add tests that verify default-all-tests behavior when no `--test` filter is supplied.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `run-test-filter`: clarify normative default behavior when `--test` is missing and ensure CLI help text communicates it.
- `capture-json-update`: add explicit documentation requirements for `update` usage and pass-through examples.
- `workflow-log`: add explicit documentation requirements for `log` field behavior and examples.

## Impact

- `src/index.ts`: help text wording for `--test` and any behavior guardrails for default execution path.
- `docs/reference/cli.md`: `--test` description and default behavior notes.
- `docs/reference/workflow-syntax.md`: improved coverage for `captures.<capture>.update` and `steps.[step].log`.
- `test/`: regression coverage for default-all-tests execution when `--test` is omitted.
- Runner repo OpenSpec: mirrored change to keep cross-repo behavior contract aligned.
