import type { getProfileAddressesAction } from '@/entities/profile/profile.actions';

import { ProfileAddressesFetchError } from './profile-addresses-fetch-error';
import { ProfileAddressesRenderer } from './profile-addresses-renderer';

type Props = { addressesPromise: ReturnType<typeof getProfileAddressesAction> };

export async function ProfileAddressesContainer({ addressesPromise }: Props) {
  const result = await addressesPromise;

  if (!result?.isSuccess) return <ProfileAddressesFetchError description={result?.message} />;

  return <ProfileAddressesRenderer addresses={result.data} />;
}
