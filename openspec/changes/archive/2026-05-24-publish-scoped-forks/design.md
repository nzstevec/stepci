## Context

The StepCI and Runner repositories are open source, but npm package ownership for `stepci` and `@stepci/runner` remains with the upstream maintainers. A fork can be published independently only under package names that you control, typically your own npm scope. The forked StepCI package must also consume the forked Runner package so testers who install your CLI automatically get your modified runner.

This change establishes a fork-specific publishing path for both repositories using the `@steve.clogic` scope, while keeping local development through `npm link` and source builds practical.

Constraints:
- Do not rely on upstream npm package ownership.
- Keep fork-specific changes minimal and easy to maintain across upstream merges.
- Ensure package installation for testers is straightforward and reproducible.
- Preserve existing build and runtime entrypoints wherever possible.

## Goals / Non-Goals

**Goals:**
- Publish Runner as `@steve.clogic/runner`.
- Publish StepCI as `@steve.clogic/stepci`.
- Update StepCI to depend on `@steve.clogic/runner`.
- Document local linking, publishing, and tester installation flow.
- Keep local source development aligned with published package behavior.

**Non-Goals:**
- Replacing or taking ownership of upstream npm packages.
- Reworking the upstream release process.
- Introducing CI/CD publish automation in the initial iteration.
- Changing runtime behavior beyond package naming and dependency wiring.

## Decisions

1. Use the `@steve.clogic` npm scope for both packages.
- Decision: Publish the forked packages as `@steve.clogic/runner` and `@steve.clogic/stepci`.
- Rationale: Scoped packages are the standard way to publish independent forks without colliding with upstream package ownership.
- Alternative considered: Publishing renamed unscoped packages; rejected because scope ownership is clearer and less likely to collide.

2. Make the forked StepCI package depend directly on the scoped Runner package.
- Decision: Replace `@stepci/runner` with `@steve.clogic/runner` in StepCI package metadata.
- Rationale: A tester installing the forked CLI should not need manual dependency overrides.
- Alternative considered: Keeping the upstream runner dependency and asking testers to override it locally; rejected because it is brittle and hard to repeat.

3. Preserve existing package layout and runtime entrypoints.
- Decision: Keep the existing build scripts, bin entry, and dist layout, changing only package identity, dependency targets, and supporting docs.
- Rationale: Minimizes regression risk and keeps merges from upstream manageable.
- Alternative considered: Restructuring package outputs or release scripts; rejected as unnecessary for the first forked release.

4. Support both local-link and published-package workflows.
- Decision: Document `npm link` for local development and scoped npm publishing for external testing.
- Rationale: Local linking is best for fast iteration, while published scoped packages are the best path for other testers.
- Alternative considered: Publishing only and omitting local linking guidance; rejected because local development is still required.

## Risks / Trade-offs

- [Risk] Future upstream merges may overwrite scoped package names or dependency targets.
  - Mitigation: Keep fork-specific publishing changes isolated and documented.

- [Risk] Testers may accidentally install upstream `stepci` instead of the scoped fork.
  - Mitigation: Provide explicit install commands and a short tester guide.

- [Risk] Version confusion between upstream and forked packages.
  - Mitigation: Use a documented fork versioning strategy and release note entries.

- [Trade-off] Manual publishing keeps the first release simple but is more error-prone than automation.
  - Mitigation: Document an ordered manual release checklist for both repos.

## Migration Plan

1. Update Runner package metadata to `@steve.clogic/runner` and verify local build/test flow.
2. Publish the Runner fork to npm under the `@steve.clogic` scope.
3. Update StepCI package metadata to `@steve.clogic/stepci`.
4. Change the StepCI dependency from `@stepci/runner` to `@steve.clogic/runner`.
5. Build and test StepCI against the scoped Runner package.
6. Publish the StepCI fork to npm under the `@steve.clogic` scope.
7. Document tester installation and verification steps.

Rollback strategy:
- Prefer publishing corrected patch versions rather than relying on unpublish.
- For local development, revert package metadata and dependency changes in git if necessary.

## Open Questions

- Will the scoped packages be published as public packages or as private scoped packages with restricted access?
- What exact fork versioning suffix or convention should distinguish the fork from upstream releases?
- Should publish steps later be automated in CI once the manual flow is stable?
