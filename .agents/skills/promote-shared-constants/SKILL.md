---
name: promote-shared-constants
description: Move constants, reference data, and reusable static contracts out of an entity-owned implementation file when another independent entity or feature needs them. Use when cross-entity imports reach into schemas, services, components, or other entity internals for shared values.
---

# Promote Shared Constants

Prevent one entity from depending on another entity's implementation files merely to reuse static values.

## Ownership decision

When a constant or reference starts in an entity file and a second independent entity or feature consumes it:

1. Confirm the value represents a genuinely shared policy or contract, rather than behavior owned by the original entity.
2. Move its single declaration to the narrowest neutral public module that owns the concern:
   - `src/configs/<concern>.ts` for application or API policy such as upload limits and supported formats.
   - An established shared constants directory for domain-independent reference values, if the repository has one.
   - A shared type/contracts module for type-only contracts.
   - A utility module only when executable behavior, rather than static data, is shared.
3. Name the file and exports after the shared concern, not the entity where the value was first created.
4. Update every consumer to import directly from the new public module. Do not leave the original entity as a re-export facade unless a documented external API requires a compatibility migration.

Keep a value entity-owned when every consumer belongs to that same entity boundary. Do not promote a constant merely because several files inside one entity use it.

## Contract preservation

- Preserve values, units, ordering, literal types, and readonly semantics exactly unless the task explicitly changes the contract.
- Keep related values together when they form one policy, such as accepted MIME types, file-picker formats, and maximum upload bytes.
- Use names that expose units where ambiguity is possible, such as `MAX_SIZE_BYTES`.
- Avoid duplicate declarations, circular dependencies, broad barrel files, and generic dumping grounds such as `constants.ts` or `shared.ts`.
- Do not move validation schemas, entity DTOs, or business behavior into the public constants module.

## Verification

Search for all old symbol imports and definitions, then verify:

- exactly one declaration remains;
- all consumers import from the neutral module;
- the original entity no longer owns or re-exports the shared value;
- TypeScript, focused tests, lint, and relevant full suites pass.

