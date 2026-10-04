import { render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CartSyncInitializer } from './cart-sync-initializer';

const syncLocalToServer = vi.hoisted(() => vi.fn());
let userIdentity: { userId: string } | null = null;
let pathname = '/';
let hasPendingCartSync = false;

vi.mock('next/navigation', () => ({ usePathname: () => pathname }));

vi.mock('@/entities/auth/auth.store', () => ({
  useAuthStore: (selector: (state: { userIdentity: typeof userIdentity }) => unknown) =>
    selector({ userIdentity }),
}));
vi.mock('@/stores/cart.store', () => ({
  useCartStore: (
    selector: (state: {
      syncLocalToServer: typeof syncLocalToServer;
      needsServerSync: boolean;
      pendingAddOperations: unknown[];
    }) => unknown,
  ) =>
    selector({
      syncLocalToServer,
      needsServerSync: hasPendingCartSync,
      pendingAddOperations: [],
    }),
}));

afterEach(() => {
  userIdentity = null;
  pathname = '/';
  hasPendingCartSync = false;
  syncLocalToServer.mockReset();
});

describe('CartSyncInitializer', () => {
  it('refreshes the cart whenever an authenticated application mount occurs', async () => {
    userIdentity = { userId: 'user-1' };

    render(<CartSyncInitializer />);

    await waitFor(() => expect(syncLocalToServer).toHaveBeenCalledOnce());
  });

  it('does not request a cart refresh for guests', () => {
    render(<CartSyncInitializer />);

    expect(syncLocalToServer).not.toHaveBeenCalled();
  });

  it('does not sync while the checkout route is active', () => {
    userIdentity = { userId: 'user-1' };
    pathname = '/cart/checkout';

    render(<CartSyncInitializer />);

    expect(syncLocalToServer).not.toHaveBeenCalled();
  });

  it('retries only pending cart work when connectivity returns', async () => {
    userIdentity = { userId: 'user-1' };
    hasPendingCartSync = true;
    render(<CartSyncInitializer />);

    await waitFor(() => expect(syncLocalToServer).toHaveBeenCalledOnce());
    window.dispatchEvent(new Event('online'));
    await waitFor(() => expect(syncLocalToServer).toHaveBeenCalledTimes(2));
  });
});
