## Why

Workflows that capture a full JSON object cannot pass that object directly into later HTTP `json` payloads without manual field-by-field mapping. This makes common mutation-and-reuse flows verbose and error-prone, especially when objects are large or change shape frequently.

## What Changes

- Preserve object values for full-template expressions so captured objects can flow through templating without string coercion.
- Allow full-object pass-through from captures into request JSON payloads (for example, `json: ${{captures.thebody}}`).
- Define deterministic behavior for object pass-through in templating, including when values are scalars, arrays, and objects.
- Ensure capture update results can be reused as complete objects in subsequent steps.
- Add validation and actionable errors for invalid pass-through targets (for example, non-JSON-compatible values).

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `capture-json-update`: extend requirements so updated capture objects can be passed as full objects into later request JSON payloads without explicit field mapping.

## Impact

- Runner templating and request construction paths for HTTP JSON payloads.
- Capture lifecycle behavior where updated captures are reused in subsequent steps.
- Workflow schema/docs/examples to document full-object pass-through semantics and supported shapes.
- Backward compatibility expectations for existing string-template behavior in non-object fields.
