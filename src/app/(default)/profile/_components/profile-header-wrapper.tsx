import { Suspense } from 'react';

import type { getProfileAccountAction } from '@/entities/profile/profile.actions';

import { ProfileHeaderContainer } from './profile-header-container';
import { ProfileHeaderRenderer } from './profile-header-renderer';
import { profilePersonalInfoSkeletonData } from './profile-personal-info-skeleton-data';

type Props = { accountPromise: ReturnType<typeof getProfileAccountAction> };

export function ProfileHeaderWrapper({ accountPromise }: Props) {
  return (
    <Suspense
      fallback={<ProfileHeaderRenderer user={profilePersonalInfoSkeletonData} isSkeleton />}
    >
      <ProfileHeaderContainer accountPromise={accountPromise} />
    </Suspense>
  );
}
