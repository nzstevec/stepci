## MODIFIED Requirements

### Requirement: Run command accepts optional test name filter
The `stepci run` command SHALL accept an optional `--test <name>` flag (alias `-t`). When provided, only the test whose key matches `<name>` in the workflow's `tests` map SHALL be executed. All other tests SHALL be skipped. When omitted, all named tests SHALL execute.

#### Scenario: Single test executed when --test is provided
- **WHEN** `stepci run workflow.yml --test mytest` is invoked
- **THEN** only the steps under `tests.mytest` SHALL be executed
- **THEN** all other tests in the workflow SHALL be skipped

#### Scenario: All tests executed when --test is omitted
- **WHEN** `stepci run workflow.yml` is invoked without `--test`
- **THEN** all named tests in the workflow SHALL be executed in the existing order

#### Scenario: Error when named test does not exist
- **WHEN** `stepci run workflow.yml --test nonexistent` is invoked
- **THEN** StepCI SHALL exit with a non-zero exit code
- **THEN** StepCI SHALL output an actionable error message identifying the missing test name

## ADDED Requirements

### Requirement: CLI help describes test filter behavior
The CLI help and reference documentation SHALL describe the `--test` option and state that omitting `--test` executes all named tests.

#### Scenario: Help output includes --test option
- **WHEN** a user runs `stepci run --help`
- **THEN** the output SHALL include the `--test` option description

#### Scenario: Docs include default behavior
- **WHEN** a user reads the CLI reference docs for `run`
- **THEN** the docs SHALL state that all named tests run when `--test` is omitted
