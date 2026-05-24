## ADDED Requirements

### Requirement: Workflow steps support a log field
Workflow steps SHALL support an optional `log` field. The value SHALL be a string. When present, the string SHALL be written to stdout before the step's request (if any) is executed.

#### Scenario: Log message emitted before step execution
- **WHEN** a step has a `log` field set to a non-empty string
- **THEN** that string SHALL be written to stdout before the step's HTTP request is sent

#### Scenario: Log field supports template expressions
- **WHEN** a step's `log` field contains a template expression such as `${{captures.id}}`
- **THEN** the expression SHALL be rendered using the same templating engine as other string fields
- **THEN** the resolved string SHALL be written to stdout

#### Scenario: Absent log field produces no output
- **WHEN** a step does not have a `log` field
- **THEN** no additional stdout line SHALL be emitted for that step's log

#### Scenario: Log field does not affect step execution or checks
- **WHEN** a step has a `log` field
- **THEN** the step's HTTP request, captures, and checks SHALL execute normally and be unaffected by the log value
