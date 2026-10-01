import { cleanup, render, screen } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useCheckoutStore } from '@/stores/checkout.store';

import { CheckoutAddressSelectionRenderer } from './address-selection-renderer';
import { DesktopAddressSelectionRenderer } from './desktop-address-selection-renderer';

vi.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children, ...props }: ComponentProps<'div'>) => (
    <div role="region" {...props}>
      {children}
    </div>
  ),
  CarouselContent: ({ children }: ComponentProps<'div'>) => <div>{children}</div>,
  CarouselItem: ({ children, ...props }: ComponentProps<'div'>) => <div {...props}>{children}</div>,
  CarouselPrevious: () => <button type="button">اسلاید قبلی</button>,
  CarouselNext: () => <button type="button">اسلاید بعدی</button>,
}));

const addresses = [
  {
    id: 'address-1',
    title: 'تهران، سعادت‌آباد',
    address: 'تهران، سعادت‌آباد، خیابان علامه شمالی، پلاک ۲۱',
    recipient: 'نیلوفر احمدی',
    phone: '09121234567',
    postalCode: '1998712345',
    latLng: [35.72, 51.33] as const,
  },
  {
    id: 'address-2',
    title: 'تهران، ونک',
    address: 'تهران، ونک، خیابان ملاصدرا، پلاک ۸',
    recipient: 'رضا احمدی',
    phone: '09120000000',
    postalCode: '1998754321',
    latLng: [35.75, 51.41] as const,
  },
] as const;

const drawerList = <div />;

afterEach(() => {
  useCheckoutStore.getState().clearCheckout();
  cleanup();
});

describe('CheckoutAddressSelectionRenderer', () => {
  it('shows an empty state with an address-selection action until an address is selected', () => {
    render(<CheckoutAddressSelectionRenderer drawerList={drawerList} />);

    expect(screen.getByText('نشانی تحویل انتخاب نشده است')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'انتخاب نشانی تحویل' })).toBeTruthy();
  });

  it('shows the selected address with a full-width text action to reopen the drawer', () => {
    useCheckoutStore.getState().selectAddress({
      id: 'address-1',
      title: 'تهران، سعادت‌آباد',
      address: 'تهران، سعادت‌آباد، خیابان علامه شمالی، پلاک ۲۱',
      recipient: 'نیلوفر احمدی',
      phone: '09121234567',
      postalCode: '1998712345',
      latLng: [35.72, 51.33],
    });

    render(<CheckoutAddressSelectionRenderer drawerList={drawerList} />);

    expect(screen.getByText('تهران، سعادت‌آباد، خیابان علامه شمالی، پلاک ۲۱')).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'ویرایش نشانی تحویل' }).getAttribute('data-block'),
    ).toBe('true');
  });

  it('keeps the two-column carousel and add-address action on desktop', () => {
    render(<DesktopAddressSelectionRenderer addresses={addresses} />);

    expect(screen.getByRole('radiogroup', { name: 'انتخاب نشانی تحویل' })).toBeTruthy();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'افزودن نشانی' })).toBeTruthy();
  });
});
