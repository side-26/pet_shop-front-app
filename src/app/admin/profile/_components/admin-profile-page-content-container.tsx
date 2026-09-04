import type { getCurrentUser } from '@/entities/users/users.service';

import { AdminProfilePageContentRenderer } from './admin-profile-page-content-renderer';
import { adminProfileSkeletonData } from './admin-profile-skeleton-data';

type Props = { currentUserPromise: ReturnType<typeof getCurrentUser> };

export async function AdminProfilePageContentContainer({ currentUserPromise }: Props) {
  const result = await currentUserPromise;
  return (
    <AdminProfilePageContentRenderer
      user={result.isSuccess ? result.data : adminProfileSkeletonData}
      isSkeleton={!result.isSuccess}
    />
  );
}
