'use client';

import { useRouter as useToploaderRouter } from 'nextjs-toploader/app';

/**
 * Provides programmatic navigation with the application's shared route-progress indicator.
 */
export function useRouter() {
  return useToploaderRouter();
}
