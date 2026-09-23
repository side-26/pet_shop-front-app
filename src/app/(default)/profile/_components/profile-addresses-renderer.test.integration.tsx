import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import type { ProfileAddressDTO } from '@/entities/profile/profile.dto';

import { ProfileAddressesRenderer } from './profile-addresses-renderer';
import { profileAddressesSkeletonData } from './profile-addresses-skeleton-data';

afterEach(cleanup);

const addresses: ProfileAddressDTO[] = [
  {
    _id: 'address-1',
    province: 'تهران',
    city: 'تهران',
    detailAddress: 'سعادت‌آباد، خیابان علامه شمالی',
    plate: '۲۱',
    unit: '۸',
    postalCode: '1998712345',
    receiverIsMe: true,
    firstName: 'نیلوفر',
    lastName: 'احمدی',
    nationalCode: '0012345678',
    phoneNumber: '09121234567',
  },
];

describe('ProfileAddressesRenderer', () => {
  it('renders the API address list and an add-address control at its end', () => {
    render(<ProfileAddressesRenderer addresses={addresses} />);

    expect(screen.getByText('تهران، سعادت‌آباد، خیابان علامه شمالی، پلاک ۲۱، واحد ۸')).toBeTruthy();
    expect(screen.getByText('نیلوفر احمدی')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'افزودن نشانی جدید' })).toBeTruthy();
  });

  it('renders an inviting empty state with an add-address control', () => {
    render(<ProfileAddressesRenderer addresses={[]} />);

    expect(screen.getByText('هنوز نشانی تحویلی ثبت نکرده‌اید')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'افزودن نشانی جدید' })).toBeTruthy();
  });

  it('renders an accessible non-interactive skeleton while the list streams', () => {
    const { container } = render(
      <ProfileAddressesRenderer addresses={profileAddressesSkeletonData} isSkeleton />,
    );

    expect(screen.getByRole('region', { name: 'نشانی‌های من' }).getAttribute('aria-busy')).toBe(
      'true',
    );
    expect(container.querySelector('.skeleton')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'افزودن نشانی جدید' })).toBeNull();
  });
});
