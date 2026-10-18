# Application Configuration

`configs/` owns static, shared configuration and vocabulary used across the frontend.

## Contents

- `route.path.ts` is the canonical route-path builder and navigation source.
- `contants.ts`, `currency.ts`, `typography.constant.ts`, `user-role.ts`, and image-upload modules hold stable application constants.
- `app-logo.ts` centralizes logo metadata.
- `yup.config.ts` configures shared Yup behavior and messages; its tests protect that contract.

## Rules

- Keep stable values in their narrowest reusable owner; do not duplicate route strings, role values, currencies, or upload limits at call sites.
- Configuration must be static and side-effect free. Runtime environment access belongs in an appropriate server-only infrastructure module.
- Update all consumers and focused tests when changing a public configuration contract.

## Maintenance

Update this guide whenever a configuration module is added, removed, renamed, or its ownership changes. Keep the inventory descriptive rather than exhaustive of individual constant values.
