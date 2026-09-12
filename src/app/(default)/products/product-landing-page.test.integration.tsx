import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';
import type { LandingPopularProductDTO } from '@/entities/landing/landing.dto';

import { CareGuideRenderer } from './_components/care-guide-section';
import { FeaturedProductsRenderer } from './_components/featured-products-section';
import { ProductAssuranceRenderer } from './_components/product-assurance-section';
import { ProductCategoriesSectionRenderer } from './_components/product-categories-section-renderer';
import { ProductHeroRenderer } from './_components/product-hero-section';
import { PopularBrandsSectionRenderer } from './_components/popular-brands-section-renderer';

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
  ParallaxProductMedia: ({ children, className }: { children: ReactNode; className?: string }) => (
    <div data-slot="parallax-product-media" className={className}>
      {children}
    </div>
  ),
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
  const popularProducts: LandingPopularProductDTO[] = [
    {
      id: 'product-1',
      slug: 'cat-food',
      title: 'غذای گربه',
      mainImage: 'https://cdn.example.com/cat-food.webp',
      mainImageThumbnail: 'data:image/webp;base64,AAAA',
      price: 200_000,
      discountPercentage: 20,
      discountPrice: 160_000,
    },
  ];

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
        <FeaturedProductsRenderer products={popularProducts} />
        <CareGuideRenderer />
      </>,
    );

    expect(screen.getByRole('heading', { level: 1, name: /واقعاً نیاز دارد/ })).toBeTruthy();
    expect(screen.getAllByRole('heading', { name: 'سگ‌ها' })).toHaveLength(2);
    expect(screen.getByRole('heading', { name: 'غذای گربه' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'مسیر انتخاب را کوتاه کرده‌ایم' })).toBeTruthy();
    expect(screen.queryByText('انتخاب‌های پیشنهادی')).toBeNull();
  });

  it('uses local descriptive imagery and canonical navigation', () => {
    render(
      <>
        <ProductHeroRenderer />
        <FeaturedProductsRenderer products={popularProducts} />
        <CareGuideRenderer />
      </>,
    );

    expect(
      screen.getByAltText('گلدن رتریور و گربه پرشین در خانه روشن').getAttribute('loading'),
    ).toBe('lazy');
    expect(
      screen
        .getByAltText('گلدن رتریور و گربه پرشین در خانه روشن')
        .closest('[data-slot="parallax-product-media"]')?.className,
    ).toContain('tw:lg:block');
    expect(
      screen.getByAltText('داستان انتخاب آگاهانه محصولات پت از شناخت نیاز تا تحویل در خانه'),
    ).toBeTruthy();
    expect(screen.getByRole('link', { name: /مشاهده جزییات محصول/ }).getAttribute('href')).toBe(
      routePaths.productDetail('cat-food'),
    );
    expect(screen.getByText('پرفروش')).toBeTruthy();
    expect(screen.getByText('۱۶۰٬۰۰۰')).toBeTruthy();
    expect(
      screen.getByRole('region', { name: 'محصولات محبوب' }).getAttribute('aria-roledescription'),
    ).toBe('carousel');
  });

  it('keeps popular-product skeleton cards non-interactive', () => {
    render(<FeaturedProductsRenderer products={popularProducts} isSkeleton />);

    expect(
      screen.getByRole('link', { name: /مشاهده جزییات محصول/ }).getAttribute('aria-disabled'),
    ).toBe('true');
    expect(screen.getByRole('link', { name: /مشاهده جزییات محصول/ }).getAttribute('tabindex')).toBe(
      '-1',
    );
  });

  it('links each popular brand logo to its brand-filtered product list', () => {
    render(
      <PopularBrandsSectionRenderer
        brands={[
          {
            id: 'brand-1',
            title: 'Royal Canin',
            title_fa: 'رویال کنین',
            logo: 'https://cdn.example.com/royal-canin.webp',
            thumbnailLogo: 'data:image/webp;base64,AAAA',
            productCount: 12,
          },
        ]}
      />,
    );

    expect(screen.getByRole('link', { name: 'محصولات برند رویال کنین' }).getAttribute('href')).toBe(
      routePaths.productsListByBrand('Royal Canin'),
    );
  });

  it('emphasizes the regular price when a popular product has no discount', () => {
    render(
      <FeaturedProductsRenderer
        products={[{ ...popularProducts[0], discountPercentage: 0, discountPrice: 200_000 }]}
      />,
    );

    expect(screen.getByText('۲۰۰٬۰۰۰').parentElement?.parentElement?.className).toContain(
      'tw:text-price-m',
    );
  });
});
