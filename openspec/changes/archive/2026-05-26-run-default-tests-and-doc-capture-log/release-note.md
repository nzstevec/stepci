## Default `run` behavior, `--test` help clarity, and docs improvements

### What changed

- `stepci run` default behavior is explicitly guaranteed: when `--test` is omitted, all named tests in the workflow are executed.
- CLI help/docs now clarify `--test` behavior and the omission default.
- Workflow syntax docs now provide clearer guidance for:
  - `captures.<capture>.update` usage and reuse of updated captures
  - `tests.<test>.steps.[step].log` output timing and template rendering support

### Verification

- Added regression coverage in StepCI CLI tests for omitted `--test` (all tests execute).
- Added regression coverage in Runner tests for omitted test filter behavior.

### Release ordering note

- Runner should be released before StepCI when behavior contracts change across both repositories.
