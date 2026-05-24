## Full-Object Capture Pass-Through in HTTP JSON Payloads

StepCI now supports passing updated capture objects directly into HTTP `json` payloads without explicit field mapping.

### What's new

- Full-expression templates in HTTP `json` fields preserve runtime types.
- Updated capture objects can be reused directly, for example:

```yaml
json: ${{captures.thebody}}
```

- Scalar full-expression templates in HTTP `json` fields preserve scalar types (number, boolean, null).
- Mixed templates that include literal text continue to behave as string interpolation.

### Error behavior

- If a full-expression template in an HTTP `json` field resolves to an undefined or unsupported value, the step now fails with an actionable serialization error.

### Compatibility

- Existing URL/header/string interpolation behavior is unchanged.
- Existing workflows that use explicit field mapping remain valid.
