import { render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CartSyncInitializer } from './cart-sync-initializer';

const syncLocalToServer = vi.hoisted(() => vi.fn());
let userIdentity: { userId: string } | null = null;

vi.mock('@/entities/auth/auth.store', () => ({
  useAuthStore: (selector: (state: { userIdentity: typeof userIdentity }) => unknown) =>
    selector({ userIdentity }),
}));
vi.mock('@/stores/cart.store', () => ({
  useCartStore: (selector: (state: { syncLocalToServer: typeof syncLocalToServer }) => unknown) =>
    selector({ syncLocalToServer }),
}));

afterEach(() => {
  userIdentity = null;
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
});
