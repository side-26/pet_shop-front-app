import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import type { ProfileOrdersPageDTO } from '@/entities/profile/profile.dto';

import { ProfileOrdersRenderer } from './profile-orders-renderer';
import { profileOrdersSkeletonData } from './profile-orders-skeleton-data';

afterEach(cleanup);

const orders: ProfileOrdersPageDTO = {
  result: [
    {
      _id: 'order-1',
      orderNumber: 'PH-1405-2841',
      deliveryState: 3,
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
      trackingCode: '',
      paymentTrackingId: '',
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

describe('ProfileOrdersRenderer', () => {
  it('renders API order data and opens its detail dialog', () => {
    render(<ProfileOrdersRenderer orders={orders} />);

    expect(screen.getByText('PH-1405-2841')).toBeTruthy();
    expect(screen.getByText('تحویل شده')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'جزئیات سفارش' }));
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('غذای خشک گربه × 2')).toBeTruthy();
  });

  it('renders a non-interactive accessible skeleton while data is pending', () => {
    const { container } = render(
      <ProfileOrdersRenderer orders={profileOrdersSkeletonData} isSkeleton />,
    );

    expect(screen.getByRole('region', { name: 'سفارش‌های من' }).getAttribute('aria-busy')).toBe(
      'true',
    );
    expect(container.querySelector('.skeleton')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'جزئیات سفارش' })).toBeNull();
  });
});
