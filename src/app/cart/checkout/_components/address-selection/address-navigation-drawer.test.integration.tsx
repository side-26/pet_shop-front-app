import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useCheckoutStore } from '@/stores/checkout.store';
import type { ProfileAddressDTO } from '@/entities/profile/profile.dto';

import { CheckoutAddressNavigationDrawer } from './address-navigation-drawer';
import { mapCheckoutAddresses } from './address-selection.mapper';
import { CheckoutAddressDrawerListComposer } from './checkout-address-drawer-list-composer';
import { CheckoutAddressDrawerListRenderer } from './checkout-address-drawer-list-renderer';

const addresses: ProfileAddressDTO[] = [
  {
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
  },
  {
    _id: 'address-2',
    province: 'تهران',
    city: 'ونک',
    detailAddress: 'خیابان ملاصدرا',
    latLng: [35.75, 51.41],
    plate: '۸',
    unit: null,
    postalCode: '1998754321',
    receiverIsMe: true,
    firstName: 'رضا',
    lastName: 'احمدی',
    nationalCode: '0012345679',
    phoneNumber: '09120000000',
  },
];

afterEach(() => {
  useCheckoutStore.getState().clearCheckout();
  cleanup();
});

describe('CheckoutAddressNavigationDrawer', () => {
  it('stores the chosen address without closing the drawer', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(<CheckoutAddressDrawerListComposer addresses={mapCheckoutAddresses(addresses)} />);

    fireEvent.click(screen.getByRole('radio', { name: /تهران، ونک/ }));

    expect(useCheckoutStore.getState().checkoutInformation.addressId).toBe('address-2');
    expect(useCheckoutStore.getState().selectedAddressCoordinates).toEqual([35.75, 51.41]);
    expect(consoleError).not.toHaveBeenCalledWith(
      expect.stringContaining('changing the uncontrolled value state of RadioGroup'),
    );

    consoleError.mockRestore();
  });

  it('opens after its animation frame and uses a full-width error footer action to close', async () => {
    const onMountChanged = vi.fn();
    render(
      <CheckoutAddressNavigationDrawer isMounted onMountChanged={onMountChanged}>
        <div />
      </CheckoutAddressNavigationDrawer>,
    );

    const closeButton = await waitFor(() => screen.getByRole('button', { name: 'بستن' }));
    expect(closeButton.getAttribute('data-color')).toBe('error');
    expect(closeButton.getAttribute('data-block')).toBe('true');

    fireEvent.click(closeButton);

    expect(onMountChanged).toHaveBeenCalled();
    expect(onMountChanged.mock.calls[0]?.[0]).toBe(false);
  });

  it('renders a non-interactive, one-column skeleton while its content streams', () => {
    const { container } = render(<CheckoutAddressDrawerListRenderer isSkeleton />);

    expect(container.querySelector('.skeleton')).toBeTruthy();
    expect(screen.queryByRole('radio')).toBeNull();
  });
});
