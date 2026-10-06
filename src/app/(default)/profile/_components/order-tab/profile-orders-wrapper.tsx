import { getProfileOrdersAction } from '@/entities/profile/profile.actions';

import { ProfileOrdersContainer } from './profile-orders-container';

export function ProfileOrdersWrapper() {
  const ordersPromise = getProfileOrdersAction();

  return <ProfileOrdersContainer ordersPromise={ordersPromise} />;
}
