## Context

`--test` filtering has been introduced, but this change formalizes and verifies default behavior when the filter is omitted. Documentation also needs to clearly describe `captures.<capture>.update` and step-level `log` in workflow syntax and CLI help paths. The behavior contract spans StepCI CLI text, runner execution semantics, and documentation expectations.

## Goals / Non-Goals

**Goals:**
- Ensure `stepci run` without `--test` executes all named tests.
- Ensure CLI help/docs clearly describe `--test` and default behavior.
- Ensure docs clearly describe capture `update` and `log` elements with examples.
- Mirror the OpenSpec change in runner so behavior/documentation contracts stay aligned across repos.

**Non-Goals:**
- Introducing multi-test selection syntax (globs/lists).
- Changing capture update runtime semantics beyond documentation and verification.
- Changing log runtime semantics beyond documentation and verification.

## Decisions

- Add/retain explicit scenario coverage in specs for default-all-tests behavior when `--test` is absent.
- Treat help text and docs as normative documentation requirements by adding MODIFIED requirements to existing capabilities.
- Keep implementation scoped: adjust help text and docs where needed, add tests to lock behavior.
- Create mirrored runner OpenSpec artifacts for the same capability deltas.

## Risks / Trade-offs

- [Risk] Behavior may already be correct, causing change to look documentation-only.
  → Mitigation: Include regression tests and explicit spec scenarios to prevent drift.
- [Risk] StepCI and runner specs can diverge if one repo lands later.
  → Mitigation: Require mirrored change and cross-repo checklist items in tasks.
- [Risk] Over-specifying docs could force frequent spec churn for wording tweaks.
  → Mitigation: Specify required coverage, not exact sentence text.
