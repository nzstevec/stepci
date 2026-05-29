## Why

`npm install` emits deprecation warnings for `json-schema-ref-parser@6.1.0` and `whatwg-encoding@3.1.1`, which obscures real install issues and increases long-term dependency risk. This must be addressed now because the warnings come from transitive paths in this repo and from dependencies pulled through the runner package.

## What Changes

- Identify and document all transitive paths that introduce `json-schema-ref-parser@6.1.0` and `whatwg-encoding@3.1.1` in StepCI installs.
- Replace deprecated parser resolution with maintained `@apidevtools/json-schema-ref-parser` resolution where currently introduced by dependency graphs.
- Replace or eliminate deprecated `whatwg-encoding` resolution by ensuring dependency resolution uses `@exodus/bytes`-based paths.
- Update lockfile and dependency constraints to keep install output free of these targeted deprecation warnings.
- Validate compatibility through build and CLI tests after dependency changes.

## Capabilities

### New Capabilities
- `dependency-hygiene`: Ensures deprecated dependency warnings targeted by this change are removed whether they originate in StepCI-local dependency paths or in runner-derived transitive paths.

### Modified Capabilities
- None.

## Impact

Affected artifacts include `package.json`, `package-lock.json`, and any dependency-resolution controls (for example, npm overrides). Potentially affected runtime surfaces include OpenAPI generation dependencies and runner HTML/encoding-related dependency paths. No user-facing workflow syntax or API changes are expected.
