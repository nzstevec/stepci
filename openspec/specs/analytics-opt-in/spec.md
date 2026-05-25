## ADDED Requirements

### Requirement: Analytics opt-in via environment variable
StepCI SHALL only send analytics events and display the analytics advisory message when the environment variable `STEPCI_ENABLE_ANALYTICS` is set to any non-empty value. When the variable is absent or empty, no network call SHALL be made and no advisory message SHALL be displayed.

#### Scenario: Analytics sent when opt-in variable is set
- **WHEN** `STEPCI_ENABLE_ANALYTICS` is set to any non-empty value
- **THEN** StepCI SHALL send an analytics event on command execution

#### Scenario: Analytics suppressed when opt-in variable is absent
- **WHEN** `STEPCI_ENABLE_ANALYTICS` is not set
- **THEN** StepCI SHALL NOT send any analytics network request
- **THEN** StepCI SHALL NOT display the analytics advisory message

#### Scenario: STEPCI_DISABLE_ANALYTICS is no longer recognised
- **WHEN** `STEPCI_DISABLE_ANALYTICS` is set and `STEPCI_ENABLE_ANALYTICS` is not set
- **THEN** StepCI SHALL NOT send any analytics event (disable variable has no effect; opt-in variable governs)
