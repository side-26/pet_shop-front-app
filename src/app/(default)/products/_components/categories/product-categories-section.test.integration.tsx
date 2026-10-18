import { Suspense } from 'react';
import { act, cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';
import type { LandingPetTypeDTO } from '@/entities/landing/landing.dto';

import { ProductCategoriesSectionContent } from './product-categories-section-content';
import { ProductCategoriesSection } from './product-categories-section';
import { ProductCategoriesSectionRenderer } from './product-categories-section-renderer';
import { productCategoriesSectionSkeletonData } from './product-categories-section-skeleton-data';

const { getProductLandingPetTypesMock } = vi.hoisted(() => ({
  getProductLandingPetTypesMock: vi.fn(),
}));

vi.mock('@/entities/landing/landing.actions', () => ({
  getProductLandingPetTypesAction: getProductLandingPetTypesMock,
  retryAllLandingPetTypesAction: vi.fn(),
}));

const petType: LandingPetTypeDTO = {
  id: 'pet-type-1',
  title: 'سگ‌ها',
  mainImage: 'https://cdn.example.com/dog.webp',
  thumbnail: 'data:image/webp;base64,AAAA',
};

beforeEach(() => {
  vi.clearAllMocks();
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
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

afterEach(cleanup);

describe('ProductCategoriesSection', () => {
  it('starts the pet-types request and provides a prefetched all-products link', async () => {
    getProductLandingPetTypesMock.mockReturnValue(Promise.resolve([]));

    await act(async () => {
      render(<ProductCategoriesSection />);
    });

    expect(getProductLandingPetTypesMock).toHaveBeenCalledOnce();
    expect(screen.getByRole('heading', { name: 'از دنیای او شروع کن' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'مشاهده محصولات بیشتر' }).getAttribute('href')).toBe(
      routePaths.productsList,
    );
    expect(screen.getByText('بیشتر').className).toContain('tw:sm:hidden');
    expect(screen.getByText('مشاهده محصولات بیشتر').className).toContain('tw:sm:inline');
  });

  it('renders a pet-type image, title, and canonical filtered-products link without legacy copy', () => {
    render(<ProductCategoriesSectionRenderer petTypes={[petType]} />);

    const [image] = screen.getAllByAltText('محصولات مناسب سگ‌ها');
    expect(image.getAttribute('src')).toContain(encodeURIComponent(petType.mainImage));
    const titles = screen.getAllByRole('heading', { name: petType.title });
    expect(titles).toHaveLength(2);
    expect(titles.every((title) => title.className.includes('tw:text-label-l'))).toBe(true);
    expect(
      screen
        .getAllByRole('link', { name: `مشاهده محصولات ${petType.title}` })
        .every((link) => link.getAttribute('href') === routePaths.productsList),
    ).toBe(true);
    expect(screen.queryByText('انتخاب‌های پیشنهادی')).toBeNull();
  });

  it('renders one-and-a-half mobile carousel cards per view and keeps skeleton links inert', () => {
    const { container } = render(
      <ProductCategoriesSectionRenderer
        petTypes={productCategoriesSectionSkeletonData}
        isSkeleton
      />,
    );
    const carousel = container.querySelector('[data-slot="carousel"]');

    expect(container.firstElementChild?.getAttribute('aria-busy')).toBe('true');
    expect(container.firstElementChild?.className).toContain('skeleton');
    expect(
      within(carousel as HTMLElement)
        .getAllByRole('group')
        .every((card) => card.className.includes('tw:basis-2/3')),
    ).toBe(true);
    expect(
      within(carousel as HTMLElement)
        .getAllByRole('link')
        .every((link) => link.getAttribute('tabindex') === '-1'),
    ).toBe(true);
  });

  it('renders a dedicated empty state for an empty category collection', async () => {
    await act(async () => {
      render(
        <Suspense fallback={null}>
          <ProductCategoriesSectionContent petTypesPromise={Promise.resolve([])} />
        </Suspense>,
      );
    });

    expect(screen.getByText('دسته‌بندی فعالی برای نمایش وجود ندارد')).toBeTruthy();
    expect(screen.getByText('به‌زودی دسته‌بندی‌های محصولات اضافه می‌شود.')).toBeTruthy();
  });
});
