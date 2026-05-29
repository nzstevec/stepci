## 1. Dependency Source Mapping

- [x] 1.1 Enumerate dependency paths in StepCI install tree that introduce `json-schema-ref-parser@6.1.0`
- [x] 1.2 Enumerate dependency paths in StepCI install tree that introduce `whatwg-encoding@3.1.1`
- [x] 1.3 Classify each path as StepCI-local or runner-derived source

## 2. Migration Implementation

- [x] 2.1 Update dependency constraints (and/or npm overrides) to replace deprecated parser resolution with `@apidevtools/json-schema-ref-parser`
- [x] 2.2 Update dependency constraints (and/or npm overrides) so deprecated encoding path resolves through `@exodus/bytes`
- [x] 2.3 Regenerate lockfile and verify resolved package graph no longer includes the two targeted deprecated packages

## 3. Validation and Documentation

- [x] 3.1 Run build and CLI regression tests to confirm no behavior regressions
- [x] 3.2 Run install verification and confirm targeted deprecation warnings are absent
- [x] 3.3 Document any remaining unrelated deprecation warnings as out-of-scope follow-up items
