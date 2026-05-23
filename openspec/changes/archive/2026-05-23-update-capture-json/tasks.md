## 1. Workflow Contract and Schema

- [ ] 1.1 Define capture update syntax fields in workflow type definitions used for schema generation
- [ ] 1.2 Regenerate schema artifacts and verify new capture update fields are represented correctly
- [ ] 1.3 Add validation rules for required update fields and unsupported value/path formats

## 2. Runner Capture Update Implementation

- [ ] 2.1 Implement capture update evaluation flow: extract base capture, resolve template values, apply ordered updates, store final capture
- [ ] 2.2 Implement deterministic path-based update utility with last-write-wins semantics
- [ ] 2.3 Implement support for writing updated output to either same capture key or a new capture key
- [ ] 2.4 Implement explicit failure handling for invalid path traversal and non-object source capture values

## 3. Test Coverage

- [ ] 3.1 Add runner tests for overriding existing keys and adding new keys
- [ ] 3.2 Add runner tests for nested path updates and conflicting updates in declaration order
- [ ] 3.3 Add runner tests for template-resolved update values from env and captures
- [ ] 3.4 Add runner tests for invalid path and non-object source failures with actionable errors

## 4. Documentation and Examples

- [x] 4.1 Update workflow syntax reference with capture update fields and semantics
- [x] 4.2 Add or update example workflow showing fetch JSON, mutate capture, and reuse in subsequent step
- [x] 4.3 Update templating or guide documentation where capture update value templating behavior needs clarification

## 5. Validation and Release Readiness

- [x] 5.1 Run full test suite and confirm no regressions in existing capture workflows
- [x] 5.2 Verify backward compatibility by running existing capture examples unchanged
- [x] 5.3 Prepare release note entry describing the new capture JSON update capability and constraints