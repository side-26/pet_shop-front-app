import type { getProfileAccountAction } from '@/entities/profile/profile.actions';

import { ProfileHeaderRenderer } from './profile-header-renderer';
import { profilePersonalInfoSkeletonData } from './profile-personal-info-skeleton-data';

type Props = {
  accountPromise: ReturnType<typeof getProfileAccountAction>;
};

export async function ProfileHeaderContainer({ accountPromise }: Props) {
  const accountResult = await accountPromise;
  if (!accountResult?.isSuccess)
    return <ProfileHeaderRenderer user={profilePersonalInfoSkeletonData} isSkeleton />;

  return <ProfileHeaderRenderer user={accountResult.data} />;
}
