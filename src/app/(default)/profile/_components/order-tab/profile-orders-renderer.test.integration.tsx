import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { ProfileOrdersPageDTO } from '@/entities/profile/profile.dto';

import { ProfileOrdersResolved } from './profile-orders-resolved';
import { ProfileOrdersSkeleton } from './profile-orders-skeleton';

const { fetchNextPage, useGetProfileOrder, useProfileOrdersPage } = vi.hoisted(() => ({
  fetchNextPage: vi.fn(),
  useGetProfileOrder: vi.fn(),
  useProfileOrdersPage: vi.fn(),
}));

vi.mock('@/entities/profile/profile.client', () => ({
  useGetProfileOrder,
  useProfileOrdersPage,
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  fetchNextPage.mockReset();
  useGetProfileOrder.mockReset();
  useProfileOrdersPage.mockReset();
});

const orders: ProfileOrdersPageDTO = {
  result: [
    {
      _id: 'order-1',
      orderNumber: 'PH-1405-2841',
      deliveryState: 3,
      paymentStatus: 'paid',
      totalPrice: 2_480_000,
      items: [
        {
          _id: 'item-1',
          item: 'product-1',
          itemType: 'product',
          quantity: 2,
          price: 1_240_000,
          discountPercentage: 0,
          title: 'غذای خشک گربه',
          mainImage: '',
          mainImageThumbnail: '',
        },
      ],
      user: 'user-1',
      trackingCode: 'TRK-1405-9912',
      paymentTrackingId: '',
      paymentExpiresAt: null,
      inventoryReservationState: null,
      inventoryReleasedAt: null,
      discountPrice: 0,
      userAddress: {
        sourceId: 'address-1',
        province: 'تهران',
        city: 'تهران',
        detailAddress: 'سعادت‌آباد',
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
      deliveryWindow: {
        id: 'delivery-1',
        provider: 'post',
        countryCode: 'IR',
        timezone: 'Asia/Tehran',
        startsAt: '2026-08-18T09:00:00.000Z',
        endsAt: '2026-08-18T12:00:00.000Z',
        shippingPrice: 0,
      },
      deliveringDateToShipping: '',
      shippingPrice: 0,
      shippingInfo: { name: '', trackingCode: '', estimateDeliveryDate: null },
      paymentType: 0,
      instalmentCompany: null,
      createdAt: '2026-08-18T09:00:00.000Z',
      updatedAt: '2026-08-18T09:00:00.000Z',
    },
  ],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 1,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    prevPage: null,
  },
};

beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    queueMicrotask(() => callback(0));
    return 1;
  });
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
  useGetProfileOrder.mockImplementation(() => ({
    data: orders.result[0],
    error: null,
    isPending: false,
  }));
  useProfileOrdersPage.mockImplementation((initialPage: ProfileOrdersPageDTO) => ({
    data: { pages: [initialPage] },
    loadedOrders: initialPage.result,
    error: null,
    fetchNextPage,
    hasNextPage: initialPage.pagination.hasNextPage,
    isFetchingNextPage: false,
  }));
});

describe('ProfileOrdersResolved', () => {
  it('renders API order data and opens its detail dialog', async () => {
    render(<ProfileOrdersResolved orders={orders} />);

    expect(screen.getByText('PH-1405-2841')).toBeTruthy();
    expect(screen.getByText('پرداخت شده')).toBeTruthy();
    expect(screen.getByText('TRK-1405-9912')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'جزئیات سفارش' }));
    expect(await screen.findByRole('dialog', { name: 'جزئیات سفارش' })).toBeTruthy();
    expect(await screen.findByText('غذای خشک گربه × 2')).toBeTruthy();
    expect(useGetProfileOrder).toHaveBeenCalledWith('order-1');
  });

  it('renders a non-interactive accessible skeleton while data is pending', () => {
    const { container } = render(<ProfileOrdersSkeleton />);

    expect(screen.getByRole('region', { name: 'سفارش‌های من' }).getAttribute('aria-busy')).toBe(
      'true',
    );
    expect(container.querySelector('.skeleton')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'جزئیات سفارش' })).toBeNull();
  });

  it('loads the next page only after the show-more text button is clicked', async () => {
    render(
      <ProfileOrdersResolved
        orders={{ ...orders, pagination: { ...orders.pagination, hasNextPage: true, nextPage: 2 } }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'نمایش سفارش‌های بیشتر' }));

    expect(fetchNextPage).toHaveBeenCalledOnce();
  });

  it('keeps the show-more control available after a next-page error', async () => {
    useProfileOrdersPage.mockReturnValue({
      data: { pages: [orders] },
      loadedOrders: orders.result,
      error: new Error('ارتباط با سرور برقرار نشد.'),
      fetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
    });

    render(
      <ProfileOrdersResolved
        orders={{ ...orders, pagination: { ...orders.pagination, hasNextPage: true, nextPage: 2 } }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'نمایش سفارش‌های بیشتر' }));

    expect((await screen.findByRole('alert')).textContent).toContain('ارتباط با سرور برقرار نشد.');
    expect(screen.getByRole('button', { name: 'نمایش سفارش‌های بیشتر' })).toBeTruthy();
  });
});
