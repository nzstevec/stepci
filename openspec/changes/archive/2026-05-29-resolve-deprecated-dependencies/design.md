## Context

StepCI currently shows targeted deprecation warnings during install for `json-schema-ref-parser@6.1.0` and `whatwg-encoding@3.1.1`. Investigation indicates these warnings may originate from transitive dependencies directly pulled by StepCI packages and from transitive dependencies introduced through the runner package dependency graph. The change needs a deterministic dependency-resolution strategy that removes these warnings without changing StepCI behavior.

## Goals / Non-Goals

**Goals:**
- Remove targeted deprecation warnings for `json-schema-ref-parser@6.1.0` and `whatwg-encoding@3.1.1` from StepCI install output.
- Cover both warning sources: StepCI-local dependency chains and runner-derived dependency chains.
- Preserve existing runtime behavior by validating build/test outcomes after dependency adjustments.

**Non-Goals:**
- Refactor unrelated dependency trees or address all npm advisories in one change.
- Introduce new StepCI CLI features or workflow syntax changes.
- Modify runner source code in this repo; this change focuses on StepCI-side dependency resolution and validation.

## Decisions

- Use maintained package targets for resolution:
  - Replace deprecated `json-schema-ref-parser` resolution with `@apidevtools/json-schema-ref-parser`.
  - Replace deprecated `whatwg-encoding` resolution by resolving to dependency paths that use `@exodus/bytes`.
- Prefer package-manager-level controls (dependency updates and/or npm overrides) to avoid invasive code changes when deprecations are transitive.
- Validate with three checks:
  - dependency tree inspection for targeted packages,
  - build and CLI test suite execution,
  - install-flow verification for absence of targeted warnings.

## Risks / Trade-offs

- [Override-based resolution could diverge from upstream maintainer intent] -> Mitigation: keep overrides minimal, version-pinned where needed, and validated with build/tests.
- [Upstream transitive changes may reintroduce warnings later] -> Mitigation: document resolved paths and keep targeted install verification in implementation checklist.
- [Potential subtle runtime behavior drift from transitive replacements] -> Mitigation: run existing build/test coverage and limit scope to targeted deprecation removal.

## Migration Plan

1. Identify active dependency chains introducing the two targeted deprecated packages.
2. Apply dependency updates/overrides in StepCI to resolve both warnings.
3. Regenerate lockfile via install.
4. Run build and CLI regression tests.
5. Verify install output no longer contains targeted deprecation warnings.
6. If regressions occur, rollback by restoring prior dependency constraints and lockfile.

## Open Questions

- Are any remaining deprecation warnings present after the targeted migration, and are they unrelated to this scoped change?
- Should the same dependency hygiene guard be mirrored in runner repository workflow to prevent reintroduction upstream?

## Source Mapping Findings

- `json-schema-ref-parser@6.1.0` source path in StepCI install tree:
  - StepCI-local chain: `@stepci/plugin-openapi -> json-schema-faker@0.5.9 -> json-schema-ref-parser@6.1.0`
- `whatwg-encoding@3.1.1` source path in StepCI install tree:
  - Runner-derived chain: `@steve.clogic/runner -> cheerio@1.2.0 -> encoding-sniffer@0.2.1 -> whatwg-encoding@3.1.1`

Classification:
- StepCI-local source: deprecated parser path via `@stepci/plugin-openapi` dependency chain.
- Runner-derived source: deprecated encoding path via runner's `cheerio` transitive chain.

## Residual Warnings Follow-up

- Targeted deprecation warnings for `json-schema-ref-parser@6.1.0` and `whatwg-encoding@3.1.1` are absent after migration.
- Current install output still reports npm vulnerabilities (moderate/high); these are security-audit items and out of scope for this deprecation-focused change.
