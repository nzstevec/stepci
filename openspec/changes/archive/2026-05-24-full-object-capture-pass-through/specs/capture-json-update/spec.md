## MODIFIED Requirements

### Requirement: Updated capture lifecycle
The workflow runner MUST expose the updated capture object to subsequent steps in the same test execution.

#### Scenario: Reuse updated capture in subsequent request
- **WHEN** a step stores an updated capture object
- **THEN** later steps in the same test MUST be able to reference the updated capture values in templates

#### Scenario: Pass updated capture object as full HTTP JSON payload value
- **WHEN** a later HTTP step sets `json` to a full template expression referencing an updated capture object
- **THEN** the request payload MUST preserve object structure and values without requiring explicit field mapping

## ADDED Requirements

### Requirement: Typed full-expression template pass-through in JSON payloads
The workflow system MUST preserve runtime value types for full-template expressions used as HTTP `json` field values.

#### Scenario: Object pass-through from capture
- **WHEN** an HTTP step sets a `json` field value to a full template expression that resolves to an object
- **THEN** the resulting request payload MUST include that value as an object, not a string

#### Scenario: Scalar pass-through from capture
- **WHEN** an HTTP step sets a `json` field value to a full template expression that resolves to a number, boolean, or null
- **THEN** the resulting request payload MUST preserve the scalar type in the serialized JSON body

#### Scenario: Mixed string template remains string
- **WHEN** an HTTP step sets a `json` field value to a mixed string template containing additional literal text and template expressions
- **THEN** the resulting value MUST be treated as a string interpolation result

### Requirement: Full-object pass-through error behavior
The workflow runner MUST fail with actionable errors when full-expression pass-through values cannot be serialized to JSON.

#### Scenario: Unsupported runtime value for JSON serialization
- **WHEN** a full-expression template used in an HTTP `json` payload resolves to a non-JSON-serializable value
- **THEN** the step MUST fail and report which template expression and payload field caused the serialization error
