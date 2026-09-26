import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { ProfileAddressDTO } from '@/entities/profile/profile.dto';

import { ProfileAddressesRenderer } from './profile-addresses-renderer';
import { profileAddressesSkeletonData } from './profile-addresses-skeleton-data';

vi.mock('nextjs-toploader/app', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

afterEach(cleanup);

const addresses: ProfileAddressDTO[] = [
  {
    _id: 'address-1',
    province: 'تهران',
    city: 'تهران',
    detailAddress: 'سعادت‌آباد، خیابان علامه شمالی',
    latLng: [35.7219, 51.3347],
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
    expect(screen.getByRole('button', { name: 'ویرایش نشانی' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'حذف نشانی' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'افزودن نشانی جدید' })).toBeTruthy();

    const details = screen.getByText('نیلوفر احمدی').closest('dl');
    expect(details?.className).toContain('tw:md:grid-cols-3');
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
