import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useAvailableDeliveryServices } from '@/entities/delivery-services/delivery-services.client';
import type { AvailableDeliveryServiceDTO } from '@/entities/delivery-services/delivery-services.dto';
import { useCheckoutStore } from '@/stores/checkout.store';

import { CheckoutDeliveryServicesClientContainer } from './delivery-services-client-container';
import { CheckoutDeliveryServicesRenderer } from './delivery-services-renderer';

vi.mock('@/entities/delivery-services/delivery-services.client', () => ({
  useAvailableDeliveryServices: vi.fn(),
}));

const services: AvailableDeliveryServiceDTO[] = [
  {
    id: 'courier',
    title: 'Courier',
    title_fa: 'پیک شهری',
    logo: 'https://cdn.example.test/courier.webp',
    packingPrice: 12_000,
    availability: [{ weekday: 'sunday', startsAt: '09:00', endsAt: '18:00' }],
    distanceKm: 8.5,
    calculatedPricePerKilometer: 45_000,
  },
];

function resetCheckoutStore() {
  useCheckoutStore.getState().clearCheckout();
}

beforeEach(resetCheckoutStore);
afterEach(resetCheckoutStore);
afterEach(cleanup);

describe('Checkout delivery services', () => {
  it('uses the delivery service selected in the checkout store', () => {
    act(() =>
      useCheckoutStore.getState().saveCheckoutInformation({ deliveryServiceId: 'courier' }),
    );

    render(<CheckoutDeliveryServicesRenderer hasSelectedAddress services={services} />);

    expect(screen.getByRole('radio', { name: 'پیک شهری' }).getAttribute('aria-checked')).toBe(
      'true',
    );
  });

  it('renders every service as a collapsible option and saves its selection for order creation', async () => {
    render(<CheckoutDeliveryServicesRenderer hasSelectedAddress services={services} />);

    const radio = screen.getByRole('radio', { name: 'پیک شهری' });
    fireEvent.click(radio);

    expect(useCheckoutStore.getState().checkoutInformation.deliveryServiceId).toBe('courier');
    await waitFor(() =>
      expect(screen.getByRole('radio', { name: 'پیک شهری' }).getAttribute('aria-checked')).toBe(
        'true',
      ),
    );
    fireEvent.click(screen.getByRole('button', { name: 'نمایش جزئیات پیک شهری' }));
    expect(screen.getByText('فاصله')).toBeTruthy();
    expect(screen.getByText('هزینه مسیر')).toBeTruthy();
    expect(screen.getByText('بسته‌بندی')).toBeTruthy();
  });

  it('uses the selected address coordinates to load available services', async () => {
    vi.mocked(useAvailableDeliveryServices).mockReturnValue({
      data: services,
      isError: false,
      isPending: false,
    } as unknown as ReturnType<typeof useAvailableDeliveryServices>);
    act(() => useCheckoutStore.getState().setSelectedAddressCoordinates([35.72, 51.33]));

    render(<CheckoutDeliveryServicesClientContainer />);

    await waitFor(() => expect(screen.getByText('پیک شهری')).toBeTruthy());
    expect(useAvailableDeliveryServices).toHaveBeenCalledWith({ lat: 35.72, lng: 51.33 });
  });

  it('shows the empty boundary when the selected address has no eligible service', async () => {
    vi.mocked(useAvailableDeliveryServices).mockReturnValue({
      data: [],
      isError: false,
      isPending: false,
    } as unknown as ReturnType<typeof useAvailableDeliveryServices>);
    act(() => useCheckoutStore.getState().setSelectedAddressCoordinates([35.72, 51.33]));

    render(<CheckoutDeliveryServicesClientContainer />);

    expect(await screen.findByText('سرویس ارسالی برای این نشانی پیدا نشد')).toBeTruthy();
  });

  it('shows the error boundary and retries the request', async () => {
    const refetch = vi.fn();
    vi.mocked(useAvailableDeliveryServices).mockReturnValue({
      data: undefined,
      error: new Error('ارتباط با سرور برقرار نشد.'),
      isError: true,
      isPending: false,
      refetch,
    } as unknown as ReturnType<typeof useAvailableDeliveryServices>);
    act(() => useCheckoutStore.getState().setSelectedAddressCoordinates([35.72, 51.33]));

    render(<CheckoutDeliveryServicesClientContainer />);

    expect(await screen.findByText('دریافت سرویس‌های ارسال انجام نشد')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'دریافت دوباره اطلاعات' }));
    expect(refetch).toHaveBeenCalledOnce();
  });
});
