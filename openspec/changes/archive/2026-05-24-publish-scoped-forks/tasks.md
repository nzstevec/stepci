## 1. Runner Package Identity

- [x] 1.1 Change Runner package name to `@steve.clogic/runner`
- [ ] 1.2 Verify Runner build and test scripts still work after renaming
- [x] 1.3 Decide and document the initial fork versioning approach for Runner

## 2. StepCI Package Identity and Dependency Wiring

- [x] 2.1 Change StepCI package name to `@steve.clogic/stepci`
- [x] 2.2 Update StepCI dependency from `@stepci/runner` to `@steve.clogic/runner`
- [x] 2.3 Verify StepCI build, schema generation, and CLI execution still work with the scoped Runner dependency

## 3. Publishing Workflow

- [x] 3.1 Document npm scope ownership, npm login, and publish prerequisites
- [ ] 3.2 Publish Runner under the `@steve.clogic` scope
- [ ] 3.3 Publish StepCI under the `@steve.clogic` scope after Runner is available
- [x] 3.4 Verify a clean install of `@steve.clogic/stepci` resolves `@steve.clogic/runner`

## 4. Local Development and Tester Documentation

- [x] 4.1 Document local linking workflow between the forked Runner and StepCI repositories
- [x] 4.2 Add tester install instructions for `@steve.clogic/stepci`
- [x] 4.3 Add verification steps so testers can confirm they are using the scoped StepCI package and scoped Runner dependency
- [x] 4.4 Provide a minimal validation workflow testers can run end-to-end

## 5. Release Readiness

- [x] 5.1 Run local linking tests between the forked Runner and StepCI repos
- [x] 5.2 Run packaged install tests from a clean directory
- [x] 5.3 Prepare release notes for the forked scoped packages