import { Suspense } from 'react';

import type { getProfileOrdersAction } from '@/entities/profile/profile.actions';

import { ProfileOrdersErrorBoundary } from './profile-orders-error-boundary';
import { ProfileOrdersRenderer } from './profile-orders-renderer';
import { ProfileOrdersSkeleton } from './profile-orders-skeleton';

type Props = { ordersPromise: ReturnType<typeof getProfileOrdersAction> };

export function ProfileOrdersContainer({ ordersPromise }: Props) {
  return (
    <Suspense fallback={<ProfileOrdersSkeleton />}>
      <ProfileOrdersErrorBoundary>
        <ProfileOrdersRenderer ordersPromise={ordersPromise} />
      </ProfileOrdersErrorBoundary>
    </Suspense>
  );
}
