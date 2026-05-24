## ADDED Requirements

### Requirement: Capture JSON update operations
The workflow system MUST allow a step to derive an updated JSON capture object from an existing captured JSON value by applying declared update operations.

#### Scenario: Override existing key in captured JSON
- **WHEN** a step captures a JSON object and declares an update operation targeting an existing key
- **THEN** the resulting capture object MUST contain the updated value for that key

#### Scenario: Add new key to captured JSON
- **WHEN** a step captures a JSON object and declares an update operation targeting a key that does not yet exist
- **THEN** the resulting capture object MUST include the new key-value pair

### Requirement: Nested path update semantics
The workflow system MUST support updating nested keys by path and MUST apply updates deterministically in declaration order.

#### Scenario: Update nested object value
- **WHEN** an update operation targets a nested path within a captured JSON object
- **THEN** the resulting capture object MUST reflect the updated nested value without removing unaffected sibling keys

#### Scenario: Conflicting updates target same path
- **WHEN** multiple update operations target the same path in a single update block
- **THEN** the value from the last declared operation MUST be persisted in the resulting capture

### Requirement: Template-aware update values
The workflow system MUST evaluate template expressions in update values using standard template context before storing the updated capture.

#### Scenario: Update value sourced from environment variable
- **WHEN** an update value contains a template expression referencing env data
- **THEN** the expression MUST be resolved and the resolved value MUST be written to the resulting capture

#### Scenario: Update value sourced from prior capture
- **WHEN** an update value contains a template expression referencing an existing capture value
- **THEN** the expression MUST be resolved using runtime capture context and persisted in the resulting capture

### Requirement: Updated capture lifecycle
The workflow runner MUST expose the updated capture object to subsequent steps in the same test execution.

#### Scenario: Reuse updated capture in subsequent request
- **WHEN** a step stores an updated capture object
- **THEN** later steps in the same test MUST be able to reference the updated capture values in templates

#### Scenario: Pass updated capture object as full HTTP JSON payload value
- **WHEN** a later HTTP step sets `json` to a full template expression referencing an updated capture object
- **THEN** the request payload MUST preserve object structure and values without requiring explicit field mapping

### Requirement: Validation and failure behavior
The workflow runner MUST fail the step with actionable validation errors when update operations cannot be applied.

#### Scenario: Invalid path target type
- **WHEN** an update path targets a location that cannot be traversed due to incompatible JSON type
- **THEN** the step MUST fail and report a validation error describing the path and type conflict

#### Scenario: Non-object capture source
- **WHEN** an update block is applied to a captured value that is not a JSON object
- **THEN** the step MUST fail and report that capture updates require an object source

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
