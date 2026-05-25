## 1. Analytics Opt-In

- [x] 1.1 Replace `if (!process.env.STEPCI_DISABLE_ANALYTICS)` guard with `if (process.env.STEPCI_ENABLE_ANALYTICS)` in `src/lib/analytics.ts`
- [x] 1.2 Update advisory message in `src/lib/render.ts` to reflect opt-in wording and gate it on `STEPCI_ENABLE_ANALYTICS`
- [x] 1.3 Remove all remaining references to `STEPCI_DISABLE_ANALYTICS` from source and docs
- [x] 1.4 Update `docs/reference/cli.md` to document analytics opt-in behaviour and remove opt-out documentation

## 2. Run Test Filter

- [x] 2.1 Add `--test` / `-t` string option to the `run` command in `src/index.ts`
- [x] 2.2 Pass the `--test` value as a `tests` filter option to `runFromFile` (and `runFromYAML` in tests)
- [x] 2.3 Add error handling in the CLI to exit with a non-zero code and actionable message when the named test does not exist in the workflow
- [x] 2.4 Update `docs/reference/cli.md` with `--test` flag documentation and example

## 3. Workflow Log Field

- [x] 3.1 Add `log` as an optional string field to the workflow step type definition in the runner (cross-repo: runner must emit a `step:log` event or equivalent before step execution)
- [x] 3.2 Subscribe to the `step:log` event in `src/index.ts` and write the resolved value to stdout via `console.log`
- [x] 3.3 Confirm `log` field value is rendered through the template engine (captures, env, secrets resolvable)
- [x] 3.4 Regenerate `schema.json` via `npm run build` to include the new `log` field

## 4. Tests

- [x] 4.1 Add unit/integration test confirming no analytics network call is made when `STEPCI_ENABLE_ANALYTICS` is unset
- [x] 4.2 Add test confirming analytics event is sent when `STEPCI_ENABLE_ANALYTICS` is set
- [x] 4.3 Add test for `--test` filter: only targeted test steps execute
- [x] 4.4 Add test for `--test` with non-existent test name: exits non-zero with error message
- [x] 4.5 Add test for `log` field: string is written to stdout before step request
- [x] 4.6 Add test for `log` field with template expression: expression is resolved before output

## 5. Documentation and Release Readiness

- [x] 5.1 Update `docs/reference/workflow-syntax.md` with `log` field definition and example
- [x] 5.2 Prepare release note entry covering all three changes, including the analytics breaking change migration path
- [x] 5.3 Verify existing example workflows pass with analytics opt-in default (no `STEPCI_ENABLE_ANALYTICS` set)
