## Why

Step workflows can capture response JSON, but there is no first-class way to derive a modified capture object by updating existing keys or adding new key-value pairs. Teams currently need awkward multi-step workarounds for a common API testing flow: fetch a JSON payload, adjust selected fields, and reuse the updated object in a later request.

## What Changes

- Add workflow syntax to define capture JSON updates (override existing keys and add new keys).
- Ensure updates can source values from templates, including env, captures, secrets, and testdata references.
- Define deterministic merge semantics for nested paths and key conflicts.
- Make updated capture objects available to all subsequent steps in the same test execution.
- Add validation and clear errors for invalid update paths or unsupported value shapes.

## Capabilities

### New Capabilities
- `capture-json-update`: support creating a new capture object from an existing captured JSON value by applying key/path updates before reuse.

### Modified Capabilities
- None.

## Impact

- Workflow contract: new syntax under capture configuration for JSON update operations.
- Runner behavior: capture evaluation and merge logic for update operations.
- Docs and examples: reference syntax and practical workflow patterns for capture mutation.
- Schema generation: update contract so editors and validation recognize the new fields.
