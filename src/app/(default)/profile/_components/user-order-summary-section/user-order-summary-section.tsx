import { Suspense } from 'react';

import { getProfileOrderSummaryAction } from '@/entities/profile/profile.actions';

import { UserOrderSummarySectionContainer } from './user-order-summary-section-container';
import { UserOrderSummarySectionErrorBoundary } from './user-order-summary-section-error-boundary';
import { UserOrderSummarySectionRenderer } from './user-order-summary-section-renderer';
import { userOrderSummarySectionSkeletonData } from './user-order-summary-section-skeleton-data';

export function UserOrderSummarySection() {
  const summaryPromise = getProfileOrderSummaryAction();

  return (
    <Suspense
      fallback={
        <UserOrderSummarySectionRenderer summary={userOrderSummarySectionSkeletonData} isSkeleton />
      }
    >
      <UserOrderSummarySectionErrorBoundary>
        <UserOrderSummarySectionContainer summaryPromise={summaryPromise} />
      </UserOrderSummarySectionErrorBoundary>
    </Suspense>
  );
}
