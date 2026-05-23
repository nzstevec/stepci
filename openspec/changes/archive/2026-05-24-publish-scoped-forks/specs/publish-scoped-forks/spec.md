## ADDED Requirements

### Requirement: Scoped fork package identity
The system MUST allow the forked Runner and StepCI packages to be published under a user-owned npm scope without using the upstream package names.

#### Scenario: Runner package is published under user scope
- **WHEN** the forked Runner package is prepared for release
- **THEN** its published package identity MUST be `@steve.clogic/runner`

#### Scenario: StepCI package is published under user scope
- **WHEN** the forked StepCI package is prepared for release
- **THEN** its published package identity MUST be `@steve.clogic/stepci`

### Requirement: Scoped dependency wiring
The forked StepCI package MUST depend on the scoped Runner package so installs resolve the forked runtime automatically.

#### Scenario: Installing forked StepCI resolves forked Runner
- **WHEN** a user installs `@steve.clogic/stepci`
- **THEN** the installation MUST resolve `@steve.clogic/runner` as its runner dependency

### Requirement: Local development workflow
The project MUST support local source development using linked local repositories before publishing scoped packages.

#### Scenario: Local runner is linked into local StepCI
- **WHEN** a contributor links the local Runner checkout into the local StepCI checkout
- **THEN** StepCI MUST be able to execute from source using the linked local Runner build output

### Requirement: Publish workflow guidance
The project MUST document the steps required to publish the forked scoped packages and make them installable by another person.

#### Scenario: Contributor follows documented publish flow
- **WHEN** a contributor follows the documented release steps
- **THEN** they MUST be able to publish the scoped Runner package first, then publish the scoped StepCI package referencing it

### Requirement: Tester installation guidance
The project MUST document how another person installs and verifies the scoped fork packages.

#### Scenario: Tester installs scoped StepCI package
- **WHEN** another person installs `@steve.clogic/stepci`
- **THEN** they MUST have a documented way to verify they are using the scoped StepCI package and the scoped Runner dependency
