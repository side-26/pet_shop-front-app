# Client Stores

`stores/` owns shared client state implemented with Zustand.

## Contents

- `cart.store.ts` owns cart state and persistence-related client behavior.
- `checkout.store.ts` owns checkout-progress state.
- `common.store.ts` owns small application-wide UI state.
- Colocated unit tests verify state transitions and persistence contracts.

## Rules

- Store only client state that must outlive a component tree; server data remains in entity/server-action or query layers.
- Keep actions explicit, typed, and deterministic. Do not place backend credentials or server-only code in a store.
- Audit persistence, subscriptions, listeners, and timers for deterministic cleanup.

## Maintenance

Update this guide when store ownership, persistence behavior, or the store inventory changes. Add a local guide if a store develops domain-specific invariants.
