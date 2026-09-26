import { Suspense } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { getProfileAccountAction } from '@/entities/profile/profile.actions';

import { ProfileHeaderContainer } from './profile-header-container';
import { ProfileHeaderRenderer } from './profile-header-renderer';
import { profilePersonalInfoSkeletonData } from './profile-personal-info-skeleton-data';
import { UserOrderSummarySection } from './user-order-summary-section/user-order-summary-section';

export function ProfileHeaderWrapper() {
  const accountPromise = getProfileAccountAction();

  return (
    <Card variant="glass" size="lg">
      <CardContent className="tw:grid tw:items-center tw:gap-6 tw:md:grid-cols-[minmax(0,1fr)_auto] tw:lg:gap-10">
        <Suspense
          fallback={<ProfileHeaderRenderer user={profilePersonalInfoSkeletonData} isSkeleton />}
        >
          <ProfileHeaderContainer accountPromise={accountPromise} />
        </Suspense>
        <UserOrderSummarySection />
      </CardContent>
    </Card>
  );
}
