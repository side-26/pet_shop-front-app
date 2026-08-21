---
name: api-input-contracts
description: Define or review request-body and request-query input types for API integrations. Use when an endpoint accepts validated input, when adding DTOs or schemas, or when deriving a frontend request contract from API documentation or a user-provided endpoint specification.
---

# API Input Contracts

Keep each API input contract tied to its authoritative validation or endpoint specification.

## Source priority

1. When the endpoint input has a Yup, Zod, or equivalent runtime validation schema, export its TypeScript input type by inference from that schema. Reuse that inferred type directly or derive a narrower transport shape with `Pick` or `Omit`; do not repeat its fields as handwritten primitive properties.
2. When no validation schema exists, define an explicit transport input type from the authoritative contract supplied in the task, linked API documentation, or endpoint specification. Preserve exact field names, optionality, nullability, nesting, and scalar types.
3. If neither a validation schema nor an authoritative input contract is available, inspect the endpoint implementation when it is in scope. Otherwise stop and request the missing contract instead of guessing.

Response DTOs remain transport contracts and are not inferred from request validation schemas.

## Layering

- Keep runtime validation and its inferred type in the schema layer.
- Let request DTO aliases and service parameters depend on the inferred schema type, never the reverse.
- A UI-only field may be removed from the transport input with a type utility after validation.
- Validate untrusted Server Action input with the same schema before constructing the request body.
- Do not make a runtime schema import client code solely to obtain a type; use type-only imports where appropriate.

## Verification

- Test accepted, rejected, boundary, and normalization behavior at the schema layer.
- Test the exact request body/query passed by the service.
- Run TypeScript checking to detect drift between schema inference, DTO aliases, actions, and services.
