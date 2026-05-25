## ADDED Requirements

### Requirement: Capture update documentation coverage
The workflow documentation SHALL explicitly describe `captures.<capture>.update`, including supported path syntax, template value resolution, and reuse of updated captures in subsequent steps.

#### Scenario: Update field syntax is documented
- **WHEN** a user reads workflow syntax docs
- **THEN** docs SHALL include `captures.<capture>.update` syntax and an example

#### Scenario: Reuse behavior is documented
- **WHEN** a user reads workflow syntax docs for capture update
- **THEN** docs SHALL explain that updated capture objects can be reused in later request fields
