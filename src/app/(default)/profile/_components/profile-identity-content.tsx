'use client';

import { type ReactNode } from 'react';

import { useAuthStore } from '@/entities/auth/auth.store';

import { ProfileHeaderRenderer } from './profile-header-renderer';
import { profilePersonalInfoSkeletonData } from './profile-personal-info-skeleton-data';
import { ProfilePersonalInfoRenderer } from './profile-personal-info-renderer';
import { ProfileTabs } from './profile-tabs';

export function ProfileIdentityContent({ orders }: { orders: ReactNode }) {
  const userIdentity = useAuthStore((state) => state.userIdentity);
  const user = userIdentity ?? profilePersonalInfoSkeletonData;
  const isSkeleton = !userIdentity;

  return (
    <>
      <ProfileHeaderRenderer user={user} isSkeleton={isSkeleton} />
      <ProfileTabs
        orders={orders}
        personalInfo={<ProfilePersonalInfoRenderer user={user} isSkeleton={isSkeleton} />}
      />
    </>
  );
}
