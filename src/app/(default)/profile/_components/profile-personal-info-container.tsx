import type { getProfileAccountAction } from '@/entities/profile/profile.actions';

import { ProfilePersonalInfoRenderer } from './profile-personal-info-renderer';
import { profilePersonalInfoSkeletonData } from './profile-personal-info-skeleton-data';

type Props = { accountPromise: ReturnType<typeof getProfileAccountAction> };

export async function ProfilePersonalInfoContainer({ accountPromise }: Props) {
  const result = await accountPromise;
  if (!result?.isSuccess) {
    return (
      <ProfilePersonalInfoRenderer
        user={profilePersonalInfoSkeletonData}
        errorMessage={result?.message ?? 'خطای غیرمنتظره‌ای رخ داد.'}
      />
    );
  }

  return (
    <ProfilePersonalInfoRenderer
      user={result.data as import('@/entities/profile/profile.dto').ProfileAccountDTO}
    />
  );
}
