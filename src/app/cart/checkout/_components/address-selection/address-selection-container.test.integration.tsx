import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { ProfileAddressDTO } from '@/entities/profile/profile.dto';

import { CheckoutAddressSelectionContainer } from './address-selection-container';

vi.mock('./address-selection-renderer', () => ({
  CheckoutAddressSelectionRenderer: ({
    addresses,
  }: {
    addresses: readonly { title: string }[];
  }) => <div>{addresses.map((address) => address.title).join('|')}</div>,
}));
vi.mock('./address-selection-fetch-error', () => ({
  CheckoutAddressSelectionFetchError: ({ description }: { description?: string | null }) => (
    <div role="alert">{description}</div>
  ),
}));

afterEach(cleanup);

const address: ProfileAddressDTO = {
  _id: 'address-1',
  province: 'تهران',
  city: 'سعادت‌آباد',
  detailAddress: 'خیابان علامه',
  latLng: [35.72, 51.33],
  plate: '۲۱',
  unit: null,
  postalCode: '1998712345',
  receiverIsMe: true,
  firstName: 'نیلوفر',
  lastName: 'احمدی',
  nationalCode: '0012345678',
  phoneNumber: '09121234567',
};

describe('CheckoutAddressSelectionContainer', () => {
  it('maps successful API data into checkout address cards', async () => {
    const content = await CheckoutAddressSelectionContainer({
      addressesPromise: Promise.resolve({ isSuccess: true, message: null, data: [address] }),
    } as never);

    render(content);

    expect(screen.getByText('تهران، سعادت‌آباد')).toBeTruthy();
  });

  it('shows the fetch recovery UI for normalized API failures', async () => {
    const content = await CheckoutAddressSelectionContainer({
      addressesPromise: Promise.resolve({
        isSuccess: false,
        message: 'دریافت نشانی ناموفق بود.',
        data: { messages: {}, details: {} },
      }),
    } as never);

    render(content);

    expect(screen.getByRole('alert').textContent).toBe('دریافت نشانی ناموفق بود.');
  });
});
