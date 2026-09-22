import { Suspense } from 'react';

import { getProfileOrdersAction } from '@/entities/profile/profile.actions';

import { ProfileOrdersContainer } from './profile-orders-container';
import { ProfileOrdersRenderer } from './profile-orders-renderer';
import { profileOrdersSkeletonData } from './profile-orders-skeleton-data';

export function ProfileOrdersWrapper() {
  const ordersPromise = getProfileOrdersAction();

  return (
    <Suspense fallback={<ProfileOrdersRenderer orders={profileOrdersSkeletonData} isSkeleton />}>
      <ProfileOrdersContainer ordersPromise={ordersPromise} />
    </Suspense>
  );
}
