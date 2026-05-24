## 1. Templating and Payload Evaluation

- [x] 1.1 Add typed evaluation path for full-template expressions used in HTTP `json` payload values
- [x] 1.2 Keep existing string interpolation behavior for mixed templates and non-typed fields
- [x] 1.3 Add clear failure paths when evaluated values cannot be represented in JSON serialization

## 2. HTTP JSON Request Construction

- [x] 2.1 Update HTTP request builder to preserve object/array/scalar runtime types for full-expression `json` values
- [x] 2.2 Ensure `${{captures.thebody}}` works as full-object pass-through in `json` without explicit field mapping
- [x] 2.3 Ensure compatibility with existing JSON payload flows that already pass literals and interpolated strings

## 3. Capture Update Reuse Coverage

- [x] 3.1 Add tests for passing updated capture objects into subsequent HTTP `json` payloads as full objects
- [x] 3.2 Add tests for scalar full-expression pass-through (number, boolean, null) in HTTP `json` fields
- [x] 3.3 Add tests confirming mixed string templates in `json` fields remain string results
- [x] 3.4 Add tests for actionable errors on non-serializable full-expression values

## 4. Documentation and Examples

- [x] 4.1 Update workflow syntax and templating docs with full-object pass-through semantics and examples
- [x] 4.2 Add or update example workflow showing capture update and direct `json: ${{captures.thebody}}` reuse
- [x] 4.3 Document limitations and backward-compatibility expectations for string interpolation behavior

## 5. Validation and Release Readiness

- [x] 5.1 Run regression checks for existing workflows that rely on string interpolation
- [x] 5.2 Verify no behavior change for URL/header and other string-only template fields
- [x] 5.3 Prepare release note entry for full-object capture pass-through in HTTP `json` payloads
