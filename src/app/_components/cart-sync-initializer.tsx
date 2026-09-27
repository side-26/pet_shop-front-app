'use client';

import { useEffect } from 'react';

import { useAuthStore } from '@/entities/auth/auth.store';
import { useCartStore } from '@/stores/cart.store';

/** Retries persisted idempotent cart additions when an authenticated browser can reconnect. */
export function CartSyncInitializer() {
  const userIdentity = useAuthStore((state) => state.userIdentity);
  const hasPendingCartSync = useCartStore(
    (state) => state.pendingAddOperations.length > 0 || state.needsServerSync,
  );
  const syncLocalToServer = useCartStore((state) => state.syncLocalToServer);

  useEffect(() => {
    if (!userIdentity || !hasPendingCartSync) return;

    const retry = () => void syncLocalToServer();
    const retryWhenVisible = () => {
      if (document.visibilityState === 'visible') retry();
    };

    retry();
    window.addEventListener('online', retry);
    window.addEventListener('focus', retry);
    document.addEventListener('visibilitychange', retryWhenVisible);

    return () => {
      window.removeEventListener('online', retry);
      window.removeEventListener('focus', retry);
      document.removeEventListener('visibilitychange', retryWhenVisible);
    };
  }, [hasPendingCartSync, syncLocalToServer, userIdentity]);

  return null;
}
