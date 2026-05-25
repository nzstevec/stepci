## 1. Run Command Behavior

- [x] 1.1 Verify `stepci run` executes all named tests when `--test` is omitted and add/adjust guard logic if needed
- [x] 1.2 Ensure `--test` option help text includes default behavior note (all tests run when omitted)
- [x] 1.3 Add/extend regression tests for default-all-tests behavior when no `--test` filter is provided

## 2. CLI and Workflow Docs

- [x] 2.1 Update `docs/reference/cli.md` to document `--test` option and default behavior when omitted
- [x] 2.2 Update `docs/reference/workflow-syntax.md` capture update section with clearer `update` usage and reuse examples
- [x] 2.3 Update `docs/reference/workflow-syntax.md` log field section to describe output timing and template support

## 3. Cross-Repo Runner Alignment

- [x] 3.1 Create mirrored OpenSpec change in runner repo with matching proposal/design/spec/task artifacts
- [x] 3.2 Add runner-side regression test confirming all tests run when filter is absent
- [x] 3.3 Ensure runner docs/spec references for `log` and test filter remain aligned with StepCI change intent

## 4. Validation and Release Readiness

- [x] 4.1 Run StepCI build/tests and confirm no regressions in existing workflow execution
- [x] 4.2 Run runner tests for default behavior and filter behavior
- [x] 4.3 Prepare release notes/changelog notes summarizing help/doc clarifications and default behavior guarantee
