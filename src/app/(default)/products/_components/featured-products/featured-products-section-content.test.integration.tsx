import { Suspense } from 'react';
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { LandingPopularProductDTO } from '@/entities/landing/landing.dto';

import { FeaturedProductsSectionContent } from './featured-products-section-content';

const product: LandingPopularProductDTO = {
  id: 'product-1',
  slug: 'cat-food',
  title: 'غذای گربه',
  mainImage: 'https://cdn.example.com/cat-food.webp',
  price: 200_000,
  discountPercentage: 0,
  discountPrice: 200_000,
};

afterEach(cleanup);

beforeEach(() => {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
  });

  vi.stubGlobal(
    'ResizeObserver',
    class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
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
});

describe('FeaturedProductsSectionContent', () => {
  it('renders the product carousel for populated data', async () => {
    await act(async () => {
      render(
        <Suspense fallback={null}>
          <FeaturedProductsSectionContent popularProductsPromise={Promise.resolve([product])} />
        </Suspense>,
      );
    });

    expect(screen.getByRole('heading', { name: product.title })).toBeTruthy();
  });

  it('renders a dedicated empty state for an empty popular-products collection', async () => {
    await act(async () => {
      render(
        <Suspense fallback={null}>
          <FeaturedProductsSectionContent popularProductsPromise={Promise.resolve([])} />
        </Suspense>,
      );
    });

    expect(screen.getByText('محصول محبوبی برای نمایش وجود ندارد')).toBeTruthy();
    expect(screen.getByText('به‌زودی محصولات محبوب جدیدی اضافه می‌شود.')).toBeTruthy();
  });
});
