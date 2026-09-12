import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';
import type { LandingPetTypeDTO } from '@/entities/landing/landing.dto';

import { ProductCategoriesSectionContainer } from './product-categories-section-container';
import { ProductCategoriesSection } from './product-categories-section';
import { ProductCategoriesSectionRenderer } from './product-categories-section-renderer';
import { productCategoriesSectionSkeletonData } from './product-categories-section-skeleton-data';

const { getAllLandingPetTypesMock, retryAllLandingPetTypesActionMock } = vi.hoisted(() => ({
  getAllLandingPetTypesMock: vi.fn(),
  retryAllLandingPetTypesActionMock: vi.fn(),
}));

vi.mock('@/entities/landing/landing.actions', () => ({
  retryAllLandingPetTypesAction: retryAllLandingPetTypesActionMock,
}));
vi.mock('@/entities/landing/landing.service', () => ({
  getAllLandingPetTypes: getAllLandingPetTypesMock,
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

describe('ProductCategoriesSection', () => {
  it('starts the pet-types request and provides a prefetched all-products link', () => {
    getAllLandingPetTypesMock.mockReturnValue(new Promise(() => undefined));

    render(<ProductCategoriesSection />);

    expect(getAllLandingPetTypesMock).toHaveBeenCalledOnce();
    expect(screen.getByRole('heading', { name: 'از دنیای او شروع کن' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'مشاهده محصولات بیشتر' }).getAttribute('href')).toBe(
      routePaths.productsList,
    );
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
        .every(
          (link) => link.getAttribute('href') === routePaths.productsListByPetType(petType.id),
        ),
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

  it('renders the targeted retry error and hides the section when the API is empty', async () => {
    const error = await ProductCategoriesSectionContainer({
      petTypesPromise: Promise.resolve({
        isSuccess: false,
        message: 'ارتباط با سرور برقرار نشد.',
        data: { messages: {}, details: {} },
      }),
    });
    const empty = await ProductCategoriesSectionContainer({
      petTypesPromise: Promise.resolve({ isSuccess: true, message: null, data: [] }),
    });
    const { rerender } = render(error);

    expect(screen.getByText('دریافت دسته‌بندی محصولات انجام نشد')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'دریافت دوباره اطلاعات' }));
    expect(retryAllLandingPetTypesActionMock).toHaveBeenCalledOnce();

    rerender(empty);
    expect(screen.queryByText('دریافت دسته‌بندی محصولات انجام نشد')).toBeNull();
  });
});
