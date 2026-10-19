import { use } from 'react';

import type { getProfileOrdersAction } from '@/entities/profile/profile.actions';
import { EmptyStateBoundary } from '@/components/ui/empty-state-boundary';

import { ProfileOrdersResolved } from './profile-orders-resolved';
import { ProfileOrdersState } from './profile-orders-state';

type Props = { ordersPromise: ReturnType<typeof getProfileOrdersAction> };

export function ProfileOrdersContainer({ ordersPromise }: Props) {
  const orders = use(ordersPromise);

  return (
    <EmptyStateBoundary data={orders.result} fallback={<ProfileOrdersState />}>
      <ProfileOrdersResolved orders={orders} />
    </EmptyStateBoundary>
  );
}
