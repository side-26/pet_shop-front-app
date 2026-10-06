'use client';

import { type ReactNode } from 'react';

import { useAuthStore } from '@/entities/auth/auth.store';

import { ProfilePersonalInfoRenderer } from './profile-personal-info-renderer';
import { profilePersonalInfoSkeletonData } from './profile-personal-info-skeleton-data';
import { ProfileTabs } from './profile-tabs';
export function ProfileIdentityContent({
  addresses,
  header,
  orders,
}: {
  addresses: ReactNode;
  header: ReactNode;
  orders: ReactNode;
}) {
  const userIdentity = useAuthStore((state) => state.userIdentity);
  const user = userIdentity ?? profilePersonalInfoSkeletonData;

  return (
    <>
      {header}
      <ProfileTabs
        addresses={addresses}
        orders={orders}
        personalInfo={<ProfilePersonalInfoRenderer user={user} isSkeleton={!userIdentity} />}
      />
    </>
  );
}
