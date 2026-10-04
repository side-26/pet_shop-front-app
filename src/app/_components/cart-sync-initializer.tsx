'use client';

import { useEffect } from 'react';

import { useAuthStore } from '@/entities/auth/auth.store';
import { useCartStore } from '@/stores/cart.store';

/** Refreshes the authenticated cart on app mount and retries pending cart operations when reconnecting. */
export function CartSyncInitializer() {
  const userIdentity = useAuthStore((state) => state.userIdentity);
  const syncLocalToServer = useCartStore((state) => state.syncLocalToServer);

  useEffect(() => {
    if (!userIdentity) return;

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
  }, [syncLocalToServer, userIdentity]);

  return null;
}
