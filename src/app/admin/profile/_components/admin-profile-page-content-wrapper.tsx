import { Suspense } from 'react';

import { getCurrentUser } from '@/entities/users/users.service';

import { AdminProfilePageContentContainer } from './admin-profile-page-content-container';
import { AdminProfilePageContentRenderer } from './admin-profile-page-content-renderer';
import { adminProfileSkeletonData } from './admin-profile-skeleton-data';

export function AdminProfilePageContentWrapper() {
  const currentUserPromise = getCurrentUser();

  return (
    <Suspense
      fallback={<AdminProfilePageContentRenderer user={adminProfileSkeletonData} isSkeleton />}
    >
      <AdminProfilePageContentContainer currentUserPromise={currentUserPromise} />
    </Suspense>
  );
}
