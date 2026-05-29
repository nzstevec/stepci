## ADDED Requirements

### Requirement: Targeted deprecated package paths are removed
The StepCI project MUST eliminate dependency resolution paths that install `json-schema-ref-parser@6.1.0` and `whatwg-encoding@3.1.1` in normal install flows.

#### Scenario: Deprecated parser package path is resolved to maintained package
- **WHEN** dependency resolution is evaluated after this change
- **THEN** any previous `json-schema-ref-parser@6.1.0` path is replaced by maintained `@apidevtools/json-schema-ref-parser` resolution

#### Scenario: Deprecated encoding package path is resolved to maintained package
- **WHEN** dependency resolution is evaluated after this change
- **THEN** any previous `whatwg-encoding@3.1.1` path is replaced by dependency paths using `@exodus/bytes`

### Requirement: Scope includes StepCI-local and runner-derived transitive dependencies
The implementation SHALL address targeted deprecation warnings regardless of whether they originate in direct StepCI dependency trees or dependency trees introduced through the runner package.

#### Scenario: StepCI-local chain warning source is covered
- **WHEN** warning source analysis identifies a StepCI-local transitive path
- **THEN** dependency controls in this repository resolve the targeted warning source

#### Scenario: Runner-derived chain warning source is covered
- **WHEN** warning source analysis identifies a runner-derived transitive path in StepCI installs
- **THEN** dependency controls in this repository resolve the targeted warning source without requiring immediate runner source changes

### Requirement: Compatibility is validated after dependency migration
The project MUST preserve existing behavior after dependency resolution changes.

#### Scenario: Build and CLI tests remain green
- **WHEN** targeted dependency changes and lockfile updates are applied
- **THEN** StepCI build and CLI regression tests pass

#### Scenario: Install output excludes targeted warnings
- **WHEN** `npm install` is run after the migration
- **THEN** output does not include deprecation warnings for `json-schema-ref-parser@6.1.0` or `whatwg-encoding@3.1.1`
