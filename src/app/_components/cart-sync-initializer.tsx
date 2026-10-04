'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { useAuthStore } from '@/entities/auth/auth.store';
import { routePaths } from '@/configs/route.path';
import { useCartStore } from '@/stores/cart.store';

/** Hydrates authenticated carts outside checkout and retries only pending work after reconnecting. */
export function CartSyncInitializer() {
  const pathname = usePathname();
  const userIdentity = useAuthStore((state) => state.userIdentity);
  const syncLocalToServer = useCartStore((state) => state.syncLocalToServer);
  const hasPendingCartSync = useCartStore(
    (state) => state.needsServerSync || state.pendingAddOperations.length > 0,
  );

  useEffect(() => {
    if (!userIdentity || pathname === routePaths.checkout) return;

    void syncLocalToServer();
  }, [pathname, syncLocalToServer, userIdentity]);

  useEffect(() => {
    if (!userIdentity || pathname === routePaths.checkout || !hasPendingCartSync) return;

    const retryPendingSync = () => void syncLocalToServer();
    window.addEventListener('online', retryPendingSync);
    return () => {
      window.removeEventListener('online', retryPendingSync);
    };
  }, [hasPendingCartSync, pathname, syncLocalToServer, userIdentity]);

  return null;
}
