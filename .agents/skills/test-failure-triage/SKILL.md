---
name: test-failure-triage
description: Diagnose and fix failed automated tests by comparing the related production component or logic with the test's expected contract before deciding which layer is wrong. Use whenever a unit, integration, component, or end-to-end test fails.
---

# Test Failure Triage

Treat a failed test as evidence, not proof that either production code or test code is defective.

## Workflow

1. Reproduce the failure when practical and capture the exact assertion, runtime error, rendered state, and relevant timing or environment conditions.
2. Inspect the production component or logic and the related test together. Trace the user-visible or programmatic contract exercised by the failing assertion.
3. Check for conflict between implementation behavior, test expectations, documented requirements, established call sites, accessibility semantics, and the underlying library API.
4. Identify the faulty layer from evidence:
   - Fix production code when it violates the intended contract or contains defective behavior.
   - Fix the test when production behavior is correct but setup, selectors, event simulation, timing, mocks, or assertions do not represent the contract accurately.
   - Fix both when production behavior and test coverage each contain an independent defect.
5. Preserve meaningful coverage. Do not weaken or delete a valid assertion merely to make the suite pass, and do not change production behavior solely to accommodate an unrealistic test.
6. Add or refine regression coverage when the failure exposes an untested boundary.
7. Run the focused failing test first, then proportionate type checking, linting, related tests, and broader validation required by the repository.

## Reporting

State the root cause, which layer changed and why, and what validation passed. If the failure cannot be reproduced or the intended contract is ambiguous, report the evidence and unresolved decision instead of guessing.
