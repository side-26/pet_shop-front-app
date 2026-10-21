import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { ProfileAddressCardDTO } from '@/entities/profile/profile.dto';

import { ProfileAddressesEmpty } from './profile-addresses-empty';
import { ProfileAddressesRenderer } from './profile-addresses-renderer';
import { profileAddressesSkeletonData } from './profile-addresses-skeleton-data';

vi.mock('@/hooks/use-router', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

afterEach(cleanup);

function renderWithQueryClient(children: ReactNode) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>);
}

const addresses: ProfileAddressCardDTO[] = [
  {
    id: 'address-1',
    title: 'تهران، تهران',
    details: 'تهران، سعادت‌آباد، خیابان علامه شمالی، پلاک ۲۱، واحد ۸',
    postalCode: '1998712345',
    firstName: 'نیلوفر',
    lastName: 'احمدی',
    phoneNumber: '09121234567',
  },
];

describe('ProfileAddressesRenderer', () => {
  it('renders the API address list and an add-address control at its end', () => {
    renderWithQueryClient(<ProfileAddressesRenderer addresses={addresses} />);

    expect(screen.getByText('تهران، سعادت‌آباد، خیابان علامه شمالی، پلاک ۲۱، واحد ۸')).toBeTruthy();
    expect(screen.getByText('نیلوفر احمدی')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'ویرایش نشانی' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'حذف نشانی' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'افزودن نشانی جدید' })).toBeTruthy();

    const details = screen.getByText('نیلوفر احمدی').closest('dl');
    expect(details?.className).toContain('tw:md:grid-cols-3');
  });

  it('renders an inviting empty state with an add-address control', () => {
    renderWithQueryClient(<ProfileAddressesEmpty />);

    expect(screen.getByText('هنوز نشانی تحویلی ثبت نکرده‌اید')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'افزودن نشانی جدید' })).toBeTruthy();
  });

  it('renders an accessible non-interactive skeleton while the list streams', () => {
    const { container } = renderWithQueryClient(
      <ProfileAddressesRenderer addresses={profileAddressesSkeletonData} isSkeleton />,
    );

    expect(screen.getByRole('region', { name: 'نشانی‌های من' }).getAttribute('aria-busy')).toBe(
      'true',
    );
    expect(container.querySelector('.skeleton')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'افزودن نشانی جدید' })).toHaveProperty(
      'disabled',
      true,
    );
  });
});
