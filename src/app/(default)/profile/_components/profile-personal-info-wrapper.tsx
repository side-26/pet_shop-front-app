import { Suspense } from 'react';

import type { getProfileAccountAction } from '@/entities/profile/profile.actions';

import { ProfilePersonalInfoContainer } from './profile-personal-info-container';
import { ProfilePersonalInfoRenderer } from './profile-personal-info-renderer';
import { profilePersonalInfoSkeletonData } from './profile-personal-info-skeleton-data';

type Props = { accountPromise: ReturnType<typeof getProfileAccountAction> };

export function ProfilePersonalInfoWrapper({ accountPromise }: Props) {
  return (
    <Suspense
      fallback={<ProfilePersonalInfoRenderer user={profilePersonalInfoSkeletonData} isSkeleton />}
    >
      <ProfilePersonalInfoContainer accountPromise={accountPromise} />
    </Suspense>
  );
}
