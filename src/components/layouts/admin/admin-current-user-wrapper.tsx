import { Suspense } from 'react';

import { getCurrentUser } from '@/entities/users/users.service';

import { AdminCurrentUserContainer } from './admin-current-user-container';
import { AdminCurrentUserIdentity } from './admin-current-user-identity';
import { adminCurrentUserSkeletonData } from './admin-current-user-skeleton-data';

export function AdminCurrentUserWrapper() {
  const currentUserPromise = getCurrentUser();

  return (
    <Suspense
      fallback={<AdminCurrentUserIdentity user={adminCurrentUserSkeletonData} isSkeleton />}
    >
      <AdminCurrentUserContainer currentUserPromise={currentUserPromise} />
    </Suspense>
  );
}
