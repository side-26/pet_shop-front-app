import type { getProfileOrdersAction } from '@/entities/profile/profile.actions';

import { ProfileOrdersRenderer } from './profile-orders-renderer';
import { profileOrdersSkeletonData } from './profile-orders-skeleton-data';

type Props = { ordersPromise: ReturnType<typeof getProfileOrdersAction> };

export async function ProfileOrdersContainer({ ordersPromise }: Props) {
  const result = await ordersPromise;

  if (!result?.isSuccess) {
    return (
      <ProfileOrdersRenderer
        orders={profileOrdersSkeletonData}
        errorMessage={result?.message ?? 'خطای غیرمنتظره‌ای رخ داد.'}
      />
    );
  }

  return <ProfileOrdersRenderer orders={result.data} />;
}
