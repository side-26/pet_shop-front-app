import { use } from 'react';

import { transformData } from '@/app/core/transformer/transform';
import { EmptyStateBoundary } from '@/components/ui/empty-state-boundary';
import type { getProfileAddressesForProfileAction } from '@/entities/profile/profile.actions';
import { ProfileAddressCardDTO } from '@/entities/profile/profile.dto';

import { ProfileAddressesEmpty } from './profile-addresses-empty';
import { ProfileAddressesRenderer } from './profile-addresses-renderer';

type Props = Readonly<{
  addressesPromise: ReturnType<typeof getProfileAddressesForProfileAction>;
}>;

export function ProfileAddressesContainer({ addressesPromise }: Props) {
  const addresses = use(addressesPromise);
  const cards = transformData(ProfileAddressCardDTO, addresses);

  return (
    <EmptyStateBoundary data={cards} fallback={<ProfileAddressesEmpty />}>
      <ProfileAddressesRenderer addresses={cards} />
    </EmptyStateBoundary>
  );
}
