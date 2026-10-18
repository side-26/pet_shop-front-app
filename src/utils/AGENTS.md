# Shared Utilities

`utils/` contains small, framework-neutral helpers shared by multiple layers.

## Contents

- `session.ts` handles encrypted session-cookie persistence and retrieval.
- `entityCache.ts` centralizes entity cache tags, cache life, and invalidation helpers.
- `address-coordinate.ts`, `helpers.ts`, `localized-digits.ts`, and `wait.ts` provide reusable conversion and utility functions.
- Colocated tests protect shared utility contracts.

## Rules

- Keep utilities pure where practical and do not introduce UI, route, or entity-specific business policy here.
- Treat session and cache helpers as security-sensitive shared contracts; preserve authentication boundaries and deterministic cache-tag behavior.
- Add or update focused tests whenever behavior or edge cases change.

## Maintenance

Update this guide when a utility module is added, removed, renamed, or promoted into a shared cross-layer contract.
