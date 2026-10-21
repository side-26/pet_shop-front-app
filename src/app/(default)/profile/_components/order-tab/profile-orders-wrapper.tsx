import { getProfileOrdersAction } from '@/entities/profile/profile.actions';

import { Suspense } from 'react';

import { ProfileOrdersContainer } from './profile-orders-container';
import { ProfileOrdersErrorBoundary } from './profile-orders-error-boundary';
import { ProfileOrdersSkeleton } from './profile-orders-skeleton';

export function ProfileOrdersWrapper() {
  const ordersPromise = getProfileOrdersAction();

  return (
    <Suspense fallback={<ProfileOrdersSkeleton />}>
      <ProfileOrdersErrorBoundary>
        <ProfileOrdersContainer ordersPromise={ordersPromise} />
      </ProfileOrdersErrorBoundary>
    </Suspense>
  );
}
