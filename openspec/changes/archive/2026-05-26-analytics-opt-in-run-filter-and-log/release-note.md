## Analytics Opt-In, Test Filtering, and Workflow Log Output

### Breaking change

- Analytics is now disabled by default.
- To enable anonymous usage telemetry, set `STEPCI_ENABLE_ANALYTICS=1`.
- `STEPCI_DISABLE_ANALYTICS` is no longer used.

### New CLI capability

- `stepci run` now supports `--test <name>` (alias `-t`).
- When provided, only `tests.<name>` is executed.
- If the test name does not exist, StepCI exits non-zero with an actionable error listing available test names.

### New workflow capability

- Steps now support a `log` field:

```yaml
steps:
  - name: Example
    log: Running request for ${{env.user}}
    http:
      url: https://example.com
      method: GET
```

- `log` values are template-resolved using standard workflow context.
- The resolved log line is printed before the step request executes.
