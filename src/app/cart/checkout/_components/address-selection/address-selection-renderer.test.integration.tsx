import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';

import { CheckoutAddressSelectionRenderer } from './address-selection-renderer';
import { checkoutAddressSelectionSkeletonData } from './address-selection-skeleton-data';
import type { CheckoutAddressViewModel } from './address-selection.types';

vi.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children, ...props }: React.ComponentProps<'div'>) => (
    <div role="region" {...props}>
      {children}
    </div>
  ),
  CarouselContent: ({ children }: React.ComponentProps<'div'>) => <div>{children}</div>,
  CarouselItem: ({ children, ...props }: React.ComponentProps<'div'>) => (
    <div role="group" {...props}>
      {children}
    </div>
  ),
  CarouselPrevious: () => <button type="button">اسلاید قبلی</button>,
  CarouselNext: () => <button type="button">اسلاید بعدی</button>,
}));

afterEach(cleanup);

const addresses: readonly CheckoutAddressViewModel[] = [
  {
    id: 'address-1',
    title: 'تهران، سعادت‌آباد',
    address: 'تهران، سعادت‌آباد، خیابان علامه شمالی، پلاک ۲۱',
    recipient: 'نیلوفر احمدی',
    phone: '09121234567',
    postalCode: '1998712345',
  },
  {
    id: 'address-2',
    title: 'تهران، ونک',
    address: 'تهران، ونک، خیابان ملاصدرا، پلاک ۸',
    recipient: 'رضا احمدی',
    phone: '09120000000',
    postalCode: '1998754321',
  },
];

describe('CheckoutAddressSelectionRenderer', () => {
  it('shows two current addresses as carousel cards without edit controls', () => {
    render(<CheckoutAddressSelectionRenderer addresses={addresses} />);

    expect(screen.getByRole('region', { name: 'نشانی‌های تحویل' })).toBeTruthy();
    expect(screen.getAllByRole('group')).toHaveLength(2);
    expect(screen.getByText('تهران، سعادت‌آباد، خیابان علامه شمالی، پلاک ۲۱')).toBeTruthy();
    expect(screen.queryByRole('button', { name: /ویرایش نشانی/ })).toBeNull();
    expect(screen.getByRole('button', { name: 'افزودن نشانی' }).getAttribute('href')).toBe(
      routePaths.profile,
    );
  });

  it('sends customers without addresses to their profile', () => {
    render(<CheckoutAddressSelectionRenderer addresses={[]} />);

    expect(screen.getByText('نشانی تحویلی ثبت نشده است')).toBeTruthy();
    screen.getAllByRole('button', { name: 'افزودن نشانی' }).forEach((button) => {
      expect(button.getAttribute('href')).toBe(routePaths.profile);
    });
  });

  it('renders an inaccessible skeleton while address data streams', () => {
    const { container } = render(
      <CheckoutAddressSelectionRenderer
        addresses={checkoutAddressSelectionSkeletonData}
        isSkeleton
      />,
    );

    expect(container.querySelector('.skeleton')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'افزودن نشانی' })).toBeNull();
  });
});
