import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';

import { CareGuideRenderer } from './_components/care-guide-section';
import { FeaturedProductsRenderer } from './_components/featured-products-section';
import { ProductAssuranceRenderer } from './_components/product-assurance-section';
import { ProductCategoriesSectionRenderer } from './_components/product-categories-section-renderer';
import { ProductHeroRenderer } from './_components/product-hero-section';

vi.mock('./_components/product-landing-motion', () => ({
  MotionSection: ({
    children,
    labelledBy,
    id,
    cacheSection,
  }: {
    children: ReactNode;
    labelledBy?: string;
    id?: string;
    cacheSection?: string;
  }) => (
    <section id={id} aria-labelledby={labelledBy} data-cache-section={cacheSection}>
      {children}
    </section>
  ),
  MotionItem: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  HeroMotion: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  ParallaxProductMedia: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

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

afterEach(cleanup);

describe('Product landing page', () => {
  it('renders the complete Persian storefront journey', () => {
    render(
      <>
        <ProductHeroRenderer />
        <ProductAssuranceRenderer />
        <ProductCategoriesSectionRenderer
          petTypes={[
            {
              id: 'dog',
              title: 'سگ‌ها',
              mainImage: 'https://cdn.example.com/dog.webp',
              thumbnail: 'data:image/webp;base64,AAAA',
            },
          ]}
        />
        <FeaturedProductsRenderer />
        <CareGuideRenderer />
      </>,
    );

    expect(screen.getByRole('heading', { level: 1, name: /واقعاً نیاز دارد/ })).toBeTruthy();
    expect(screen.getAllByRole('heading', { name: 'سگ‌ها' })).toHaveLength(2);
    expect(screen.getByRole('heading', { name: 'انتخاب‌های محبوب' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'مسیر انتخاب را کوتاه کرده‌ایم' })).toBeTruthy();
    expect(screen.queryByText('انتخاب‌های پیشنهادی')).toBeNull();
  });

  it('uses local descriptive imagery and canonical navigation', () => {
    render(
      <>
        <ProductHeroRenderer />
        <FeaturedProductsRenderer />
        <CareGuideRenderer />
      </>,
    );

    expect(screen.getByAltText('گلدن رتریور و گربه پرشین در خانه روشن')).toBeTruthy();
    expect(
      screen.getByAltText('داستان انتخاب آگاهانه محصولات پت از شناخت نیاز تا تحویل در خانه'),
    ).toBeTruthy();
    expect(screen.getByRole('link', { name: /مشاهده سبد خرید/ }).getAttribute('href')).toBe(
      routePaths.cart,
    );
    expect(
      screen.getByRole('region', { name: 'محصولات منتخب' }).getAttribute('aria-roledescription'),
    ).toBe('carousel');
  });
});
