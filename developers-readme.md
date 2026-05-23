# StepCI Developer README

This document is an engineering-oriented reference for:

- Solution architecture in this repository
- The full supported syntax for StepCI templating

## Table of Contents

- [1) Solution Architecture](#1-solution-architecture)
- [2) Quick Start for Contributors](#2-quick-start-for-contributors)
- [3) Full Supported StepCI Template Syntax](#3-full-supported-stepci-template-syntax)
- [4) Canonical References](#4-canonical-references)

## 1) Solution Architecture

### 1.1 High-level runtime flow

```text
CLI entrypoint (src/index.ts)
  -> yargs command parsing
    -> run/init/generate handlers
      -> @stepci/runner (workflow execution and load testing)
      -> @stepci/plugin-openapi (workflow generation)
      -> render layer (src/lib/render.ts)
      -> analytics layer (src/lib/analytics.ts)
```

### 1.2 Core modules in this repo

- `src/index.ts`
  - Process entrypoint (`#!/usr/bin/env node`)
  - Defines commands:
    - `run [workflow]`
    - `generate [spec] [path]`
    - `init`
  - Wires CLI arguments into runner/plugin APIs
  - Emits test/workflow events and delegates output rendering

- `src/lib/render.ts`
  - Human-readable terminal output
  - Per-test and per-step summaries
  - Protocol-aware request/response rendering (HTTP, SSE, gRPC)
  - Check rendering, workflow summary, load-test report rendering

- `src/lib/analytics.ts`
  - Anonymous telemetry plumbing used by the CLI lifecycle

- `schema.json`
  - Generated workflow schema (derived from `@stepci/runner` typings)

### 1.3 Responsibility boundaries

- This repository focuses on:
  - CLI UX
  - Argument parsing
  - Output formatting
  - Analytics wiring
  - OpenAPI-to-workflow generation command wiring

- `@stepci/runner` focuses on:
  - Workflow execution semantics
  - Protocol-specific execution and checks
  - Capture/check behavior
  - Load-testing execution internals

- `@stepci/plugin-openapi` focuses on:
  - Transforming OpenAPI specs into StepCI workflows

### 1.4 Command behavior summary

- `run`
  - Normal mode: executes workflow with optional env/secrets/concurrency
  - Load mode (`--loadtest`): executes load test and renders aggregate metrics

- `generate`
  - Converts OpenAPI into a workflow file
  - Supports generator/check toggles and content type customization

- `init`
  - Writes a minimal starter workflow

## 2) Quick Start for Contributors

Use this path when making routine CLI or docs changes.

1. Install dependencies.

```bash
npm install
```

2. Build TypeScript output.

```bash
npm run build
```

3. Run the CLI against a sample workflow.

```bash
npm test
```

4. Develop docs locally when changing docs.

```bash
npm run docs:dev
```

5. Generate and verify schema changes when runner typings change.

```bash
npm run postbuild
```

Contributor notes:

- Main CLI wiring is in `src/index.ts`
- Output formatting logic is in `src/lib/render.ts`
- Example workflows for manual checks are in `examples/`
- Keep user-facing docs aligned with behavior in `docs/reference/`

## 3) Full Supported StepCI Template Syntax

StepCI templating is powered by `liquidless` with StepCI-specific context objects and extra filters.

### 3.1 Delimiters and expression form

- StepCI uses `${{` and `}}` delimiters
- Basic form:

```text
${{ variable }}
```

- Dot-path access:

```text
${{ env.host }}
${{ captures.userId }}
${{ testdata.username }}
```

- Filter pipeline:

```text
${{ variable | filterA | filterB }}
```

- Filter with arguments:

```text
${{ variable | filterName: arg1, arg2 }}
```

- Filter arguments are JSON5-parsed values in liquidless:
  - Numbers: `1`, `1.5`
  - Booleans: `true`, `false`
  - Null: `null`
  - Quoted strings: `'text'`, `"text"`
  - Objects/arrays: `{a:1}`, `[1,2]`

### 3.2 Available template objects in StepCI

These are the supported root objects exposed by StepCI docs:

- `env`
  - Environment variables from workflow `env` and CLI `--env`

- `secrets`
  - Secret values from CLI `--secret`

- `captures`
  - Captured values from previous steps

- `testdata`
  - Current row when test data is configured

### 3.3 Built-in liquidless filters supported by StepCI

StepCI supports all built-in liquidless filters.

- `append`
- `base64_decode`
- `base64_encode`
- `camelize`
- `capitalize`
- `downcase`
- `escape`
- `hmac_sha1`
- `hmac_sha256`
- `lstrip`
- `md5`
- `newline_to_br`
- `pluralize`
- `prepend`
- `remove`
- `remove_first`
- `remove_last`
- `replace`
- `replace_first`
- `replace_last`
- `rstrip`
- `sha1`
- `sha256`
- `slice`
- `split`
- `strip`
- `strip_html`
- `strip_newlines`
- `toInt`
- `toFloat`
- `toString`
- `upcase`
- `url_decode`
- `url_encode`

### 3.4 Additional StepCI-supported filters

StepCI docs additionally call out:

- `fake`
  - Backed by `liquidless-faker`

- `naughtystring`
  - Backed by `liquidless-naughtystrings`

### 3.5 Practical examples

- Environment interpolation:

```yaml
env:
  host: example.com

http:
  url: https://${{ env.host }}
```

- Capture reuse:

```yaml
http:
  url: https://api.example.com/users/${{ captures.id }}
```

- Fake data generation:

```yaml
json:
  username: ${{ internet.userName | fake }}
```

- Fuzz input:

```yaml
formData:
  email: ${{ | naughtystring }}
```

### 3.6 Notes and edge behavior

- Unknown filters are ignored by liquidless and value passes through unchanged
- If an expression is the whole value, non-string values can be preserved as native values
- Template interpolation occurs across workflow object structures (not only single string fields)

## 4) Canonical References

- In-repo references:
  - `docs/reference/templating.md`
  - `docs/reference/workflow-syntax.md`
  - `docs/guides/using-fake-data.md`
  - `docs/guides/fuzz-testing.md`

- Upstream template engine:
  - `https://github.com/stepci/liquidless`
  - `https://github.com/stepci/liquidless/blob/main/src/filters.ts`

- Extra filter packages:
  - `https://github.com/stepci/liquidless-faker`
  - `https://github.com/stepci/liquidless-naughtystrings`
