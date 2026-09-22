import type { getProfileAccountAction } from '@/entities/profile/profile.actions';

import { ProfileHeaderRenderer } from './profile-header-renderer';
import { profilePersonalInfoSkeletonData } from './profile-personal-info-skeleton-data';

type Props = { accountPromise: ReturnType<typeof getProfileAccountAction> };

export async function ProfileHeaderContainer({ accountPromise }: Props) {
  const result = await accountPromise;
  if (!result?.isSuccess) return <ProfileHeaderRenderer user={profilePersonalInfoSkeletonData} />;

  return (
    <ProfileHeaderRenderer
      user={result.data as import('@/entities/profile/profile.dto').ProfileAccountDTO}
    />
  );
}
