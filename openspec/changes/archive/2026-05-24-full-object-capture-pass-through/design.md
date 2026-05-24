## Context

The current templating pipeline resolves expressions to string values for substitution-oriented use cases. This works for URL/header/body text interpolation but breaks object reuse flows where a captured JSON object should be passed into another request payload as an object. In current behavior, workflows often require explicit field mapping (`name`, `shortName`, `emailAddress`, etc.) even when a full updated capture object already exists.

This change targets the existing `capture-json-update` capability and must preserve backward-compatible string interpolation semantics outside typed JSON value contexts.

## Goals / Non-Goals

**Goals:**
- Allow full-object pass-through from captures into HTTP `json` payloads without explicit field mapping.
- Preserve typed values (object, array, number, boolean, null) for full-template expressions in typed JSON contexts.
- Keep existing string interpolation behavior for mixed text templates and non-typed fields.
- Provide clear validation errors when pass-through values are incompatible with target field expectations.

**Non-Goals:**
- Adding new workflow syntax for captures or updates.
- Changing behavior for templated values in URL, headers, or other string-only fields.
- Implementing arbitrary deep-merge semantics between literal JSON blocks and injected objects.

## Decisions

1. Introduce typed template evaluation for full-expression values in typed object contexts.
- Decision: If a JSON-field value is exactly one template expression (for example, `${{captures.thebody}}`), preserve its runtime type instead of forcing string conversion.
- Rationale: This supports direct object reuse while keeping existing interpolation behavior where templates are part of larger strings.
- Alternative considered: Add a new filter or syntax for object injection (e.g., `| tojson`). Rejected because it adds user-facing complexity and does not solve typed pass-through ergonomically.

2. Scope typed pass-through to HTTP `json` request construction.
- Decision: Apply typed preservation to HTTP step `json` payload values where non-string values are already valid and expected.
- Rationale: This is the primary failing flow and minimizes regression risk.
- Alternative considered: Global typed preservation in all fields. Rejected for now due to compatibility risk in string-oriented fields.

3. Preserve existing rendering semantics for mixed templates.
- Decision: Values like `"prefix-${{captures.id}}"` remain string interpolation.
- Rationale: Existing workflows rely on this behavior; changing it would be breaking.

4. Error on unsupported/invalid pass-through values for target payload shape.
- Decision: Step fails with actionable error when an injected value cannot be represented in JSON payload serialization.
- Rationale: Explicit failure is safer than silent coercion.

## Risks / Trade-offs

- [Behavior split by context] Different outcomes for full-expression vs mixed-expression templates may surprise users.
  - Mitigation: Document examples for both forms and add tests covering both.

- [Compatibility regressions] Existing edge workflows might rely on implicit `.toString()` in JSON fields.
  - Mitigation: Limit typed behavior to full-expression values and validate against existing fixture workflows.

- [Implementation coupling] Request construction now depends on richer templating result metadata.
  - Mitigation: Keep typed-evaluation logic isolated in templating utility boundary and test it directly.

## Migration Plan

- No workflow migration required for existing valid workflows.
- Users can simplify existing field-by-field mappings to full-object pass-through after upgrade.
- Rollback strategy: revert to prior templating behavior if regressions are discovered; mapped workflows remain valid in both versions.

## Open Questions

- Should typed full-expression behavior also apply to other typed fields beyond HTTP `json` in this change, or in a follow-up change?
- Should there be an opt-out compatibility flag if any edge-case regressions are found in downstream workflows?
