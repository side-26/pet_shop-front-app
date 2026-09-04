import type { getCurrentUser } from '@/entities/users/users.service';

import { AdminCurrentUserIdentity } from './admin-current-user-identity';
import { adminCurrentUserSkeletonData } from './admin-current-user-skeleton-data';

type Props = {
  currentUserPromise: ReturnType<typeof getCurrentUser>;
};

export async function AdminCurrentUserContainer({ currentUserPromise }: Props) {
  const result = await currentUserPromise;

  if (!result.isSuccess) {
    return <AdminCurrentUserIdentity user={adminCurrentUserSkeletonData} />;
  }

  return <AdminCurrentUserIdentity user={result.data} />;
}
