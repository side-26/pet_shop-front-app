import { DirectionProvider } from '@base-ui/react/direction-provider';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { LandingProductDTO } from '@/entities/landing/landing.dto';

import { OffersSectionContainer } from './offers-section-container';
import { createProductImageAlt } from './offers-section.helpers';
import { OffersSectionRenderer } from './offers-section-renderer';
import { offersSectionSkeletonData } from './offers-section-skeleton-data';

const product: LandingProductDTO = {
  id: 'product-1',
  title: 'غذای گربه',
  mainImage: 'https://s3.ir-thr-at1.arvanstorage.ir/pet-shop/cat-food.webp',
  mainImageThumbnail: 'data:image/webp;base64,AAAA',
  summary: 'غذای کامل برای گربه‌های بالغ',
  price: 200_000,
  discountPercentage: 20,
  discountPrice: 40_000,
};

beforeEach(() => {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });

  vi.stubGlobal(
    'IntersectionObserver',
    class IntersectionObserver {
      root = null;
      rootMargin = '';
      thresholds = [0];
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    },
  );
  vi.stubGlobal(
    'ResizeObserver',
    class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

describe('OffersSection', () => {
  it('renders a shared, busy, non-interactive card skeleton', () => {
    const { container } = render(
      <DirectionProvider direction="rtl">
        <OffersSectionRenderer products={offersSectionSkeletonData} isSkeleton />
      </DirectionProvider>,
    );

    const carousel = screen.getByRole('region', { name: 'پیشنهادهای شگفت‌انگیز' });
    expect(carousel.getAttribute('aria-busy')).toBe('true');
    expect(carousel.className).toContain('skeleton');
    expect(carousel.className).toContain('tw:pointer-events-none');
    expect(container.querySelectorAll('[data-slot="card"]')).toHaveLength(5);
    expect(screen.getAllByRole('button').every((button) => button.matches(':disabled'))).toBe(true);
  });

  it('renders API prices using the calculated discount amount', async () => {
    const content = await OffersSectionContainer({
      productsPromise: Promise.resolve({ isSuccess: true, message: null, data: [product] }),
    });
    render(<DirectionProvider direction="rtl">{content}</DirectionProvider>);

    expect(screen.getByRole('heading', { name: product.title })).toBeTruthy();
    expect(createProductImageAlt(product)).toBe('تصویر محصول غذای گربه');
    expect(screen.getByAltText('تصویر محصول غذای گربه')).toBeTruthy();
    expect(screen.queryByText(product.summary ?? '')).toBeNull();
    expect(screen.getByText('۲۰٪ تخفیف')).toBeTruthy();
    expect(screen.getByText('۲۰۰٬۰۰۰')).toBeTruthy();
    expect(screen.getByText('۱۶۰٬۰۰۰')).toBeTruthy();
  });

  it('normalizes failed and empty responses', async () => {
    const error = await OffersSectionContainer({
      productsPromise: Promise.resolve({
        isSuccess: false,
        message: 'ارتباط با سرور برقرار نشد.',
        data: { messages: {}, details: {} },
      }),
    });
    const empty = await OffersSectionContainer({
      productsPromise: Promise.resolve({ isSuccess: true, message: null, data: [] }),
    });
    const { rerender } = render(<DirectionProvider direction="rtl">{error}</DirectionProvider>);

    expect(screen.getByText('دریافت پیشنهادها انجام نشد')).toBeTruthy();
    expect(screen.getByText('ارتباط با سرور برقرار نشد.')).toBeTruthy();

    rerender(<DirectionProvider direction="rtl">{empty}</DirectionProvider>);
    expect(screen.getByText('پیشنهادی برای نمایش وجود ندارد')).toBeTruthy();
  });
});
