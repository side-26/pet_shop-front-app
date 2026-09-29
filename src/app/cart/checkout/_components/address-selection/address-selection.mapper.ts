import type { ProfileAddressDTO } from '@/entities/profile/profile.dto';

import type { CheckoutAddressViewModel } from './address-selection.types';

export function mapCheckoutAddresses(
  addresses: readonly ProfileAddressDTO[],
): readonly CheckoutAddressViewModel[] {
  return addresses.map((address, index) => ({
    id: address._id ?? `${address.postalCode}-${index}`,
    title: [address.province, address.city].filter(Boolean).join('، ') || 'نشانی تحویل',
    address: [
      address.city,
      address.detailAddress,
      address.plate ? `پلاک ${address.plate}` : null,
      address.unit ? `واحد ${address.unit}` : null,
    ]
      .filter(Boolean)
      .join('، '),
    recipient: `${address.firstName} ${address.lastName}`.trim(),
    phone: address.phoneNumber,
    postalCode: address.postalCode,
    latLng: address.latLng,
  }));
}
