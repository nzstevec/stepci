## Why

You have forked the StepCI and Runner repositories and need a supported way to publish and distribute your own installable packages without involving the upstream maintainers. The forked StepCI package also needs to consume the forked Runner package under your own npm scope so another person can install and test the full stack consistently.

## What Changes

- Publish the Runner fork as `@steve.clogic/runner`.
- Publish the StepCI fork as `@steve.clogic/stepci`.
- Update StepCI to depend on `@steve.clogic/runner` instead of `@stepci/runner`.
- Define the package metadata, dependency wiring, and release flow required for scoped fork publishing.
- Add documentation for local linking, local testing, and installation of the scoped fork packages.

## Capabilities

### New Capabilities
- `publish-scoped-forks`: support publishing forked StepCI and Runner packages under a user-owned npm scope with StepCI linked to the scoped Runner package.

### Modified Capabilities
- None.

## Impact

- Package metadata in the StepCI and Runner repositories.
- Dependency linkage between the forked StepCI and Runner packages.
- Release workflow and tester installation flow for the scoped packages.
- Contributor documentation for local linking and publish steps.
