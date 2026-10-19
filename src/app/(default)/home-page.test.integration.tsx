import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';

import HomePage from './page';

vi.mock('./_components/home/hero/shader-background', () => ({
  ShaderBackground: () => <div data-testid="shader-background" />,
}));

vi.mock('./_components/home/categories/categories-section', () => ({
  CategoriesSection: () => (
    <section>
      <h2>دسته‌بندی حیوانات</h2>
      <div aria-label="دسته‌بندی حیوانات" aria-roledescription="carousel" role="region">
        <a href={routePaths.pets}>گربه‌ها</a>
      </div>
    </section>
  ),
}));

vi.mock('@/entities/landing/landing.actions', () => ({
  getAllLandingPetTypesAction: () => new Promise(() => {}),
  getHomeLandingPetTypesAction: () => new Promise(() => {}),
  getDiscountedLandingProductsAction: () => new Promise(() => {}),
  retryAllLandingPetTypesAction: vi.fn(),
  retryLandingHomeOffersAction: vi.fn(),
}));

vi.mock('./_components/home/shared/motion-primitives', () => ({
  RevealSection: ({ children, labelledBy }: { children: ReactNode; labelledBy?: string }) => (
    <section aria-labelledby={labelledBy}>{children}</section>
  ),
  RevealItem: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  ParallaxMedia: ({ children }: { children: ReactNode }) => <div>{children}</div>,
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

describe('HomePage', () => {
  it('composes every storefront section with canonical product and pet links', async () => {
    render(<HomePage />);

    expect(screen.getByRole('heading', { level: 1, name: /بهترین دوستت/ })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'چرا پت‌شاپ پرشین؟' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'دسته‌بندی حیوانات' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /خرید وسایل سنگین پت/ })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'پیشنهادهای شگفت‌انگیز' })).toBeTruthy();

    expect(screen.getByRole('link', { name: 'مشاهده محصولات' }).getAttribute('href')).toBe(
      routePaths.products,
    );
    expect(
      screen.getAllByRole('link', { name: 'انتخاب بر اساس حیوان' })[0].getAttribute('href'),
    ).toBe(routePaths.pets);
    expect(screen.getAllByRole('link', { name: /گربه‌ها/ })[0].getAttribute('href')).toBe(
      routePaths.pets,
    );
  });

  it('renders descriptive local imagery and accessible carousels', async () => {
    render(<HomePage />);

    const heroImage = screen.getByAltText(/گلدن رتریور و گربه پرشین/);
    expect(heroImage.getAttribute('loading')).toBe('eager');
    expect(heroImage.getAttribute('fetchpriority')).toBe('high');
    expect(screen.getByAltText('تحویل بسته محصولات پت در درب منزل')).toBeTruthy();
    expect(
      screen
        .getAllByRole('region', { name: 'دسته‌بندی حیوانات' })
        .some((region) => region.getAttribute('aria-roledescription') === 'carousel'),
    ).toBe(true);
    expect(
      screen
        .getAllByRole('region', { name: 'پیشنهادهای شگفت‌انگیز' })
        .some((region) => region.getAttribute('aria-roledescription') === 'carousel'),
    ).toBe(true);
  });
});
