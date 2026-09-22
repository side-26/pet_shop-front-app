'use client';

import { useEffect } from 'react';

import { syncUserIdentity } from '@/entities/auth/auth.client';

/** Synchronizes client-only identity state with the server session on app load. */
export function AuthSessionInitializer() {
  useEffect(() => {
    const controller = new AbortController();
    void syncUserIdentity(controller.signal);

    return () => controller.abort();
  }, []);

  return null;
}
