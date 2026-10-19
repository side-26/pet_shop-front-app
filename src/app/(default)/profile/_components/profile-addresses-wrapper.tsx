import { Suspense } from 'react';

import { getProfileAddressesForProfileAction } from '@/entities/profile/profile.actions';

import { ProfileAddressesContainer } from './profile-addresses-container';
import { ProfileAddressesErrorBoundary } from './profile-addresses-error-boundary';
import { ProfileAddressesRenderer } from './profile-addresses-renderer';
import { profileAddressesSkeletonData } from './profile-addresses-skeleton-data';

export function ProfileAddressesWrapper() {
  const addressesPromise = getProfileAddressesForProfileAction();

  return (
    <Suspense
      fallback={<ProfileAddressesRenderer addresses={profileAddressesSkeletonData} isSkeleton />}
    >
      <ProfileAddressesErrorBoundary>
        <ProfileAddressesContainer addressesPromise={addressesPromise} />
      </ProfileAddressesErrorBoundary>
    </Suspense>
  );
}
