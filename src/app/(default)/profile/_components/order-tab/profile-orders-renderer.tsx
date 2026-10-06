import type { getProfileOrdersAction } from '@/entities/profile/profile.actions';

import { ProfileOrdersResolved } from './profile-orders-resolved';
import { ProfileOrdersState } from './profile-orders-state';

type Props = Readonly<{ ordersPromise: ReturnType<typeof getProfileOrdersAction> }>;

export async function ProfileOrdersRenderer({ ordersPromise }: Props) {
  const result = await ordersPromise;

  if (!result?.isSuccess) {
    return <ProfileOrdersState errorMessage={result?.message ?? 'خطای غیرمنتظره‌ای رخ داد.'} />;
  }

  if (result.data.result.length === 0) return <ProfileOrdersState />;

  return <ProfileOrdersResolved orders={result.data} />;
}
