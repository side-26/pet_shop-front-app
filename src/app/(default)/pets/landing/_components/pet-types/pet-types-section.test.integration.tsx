import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';
import type { LandingPetTypeDTO } from '@/entities/landing/landing.dto';

import { PetTypesSectionContainer } from './pet-types-section-container';
import { PetTypesSectionRenderer } from './pet-types-section-renderer';
import { petTypesSectionSkeletonData } from './pet-types-section-skeleton-data';

const { retryAllLandingPetTypesActionMock } = vi.hoisted(() => ({
  retryAllLandingPetTypesActionMock: vi.fn(),
}));

vi.mock('@/entities/landing/landing.actions', () => ({
  retryAllLandingPetTypesAction: retryAllLandingPetTypesActionMock,
}));

const petType: LandingPetTypeDTO = {
  id: 'pet-type-1',
  title: 'سگ‌ها',
  mainImage: 'https://s3.ir-thr-at1.arvanstorage.ir/pet-shop/dog.webp',
  thumbnail: 'data:image/webp;base64,AAAA',
};

beforeEach(() => {
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

describe('PetTypesSection', () => {
  it('renders enabled pet types as full-width flex cards', () => {
    render(<PetTypesSectionRenderer petTypes={[petType]} />);

    const image = screen.getByAltText('تصویر دسته‌بندی سگ‌ها');
    expect(image.getAttribute('src')).toContain(encodeURIComponent(petType.mainImage));
    expect(document.querySelector('[data-slot="card"]')?.className).toContain('tw:pt-0');
    expect(screen.getByRole('heading', { name: petType.title })).toBeTruthy();
    expect(screen.getByRole('link', { name: `مشاهده ${petType.title}` }).getAttribute('href')).toBe(
      routePaths.petsListByPetType(petType.id),
    );
  });

  it('renders two mobile carousel cards per view and a non-interactive skeleton', () => {
    const { container } = render(
      <PetTypesSectionRenderer petTypes={petTypesSectionSkeletonData} isSkeleton />,
    );

    const carousel = container.firstElementChild;
    expect(carousel?.getAttribute('aria-busy')).toBe('true');
    expect(carousel?.className).toContain('skeleton');
    const cards = within(carousel as HTMLElement).getAllByRole('group');
    expect(cards.every((card) => card.className.includes('tw:basis-1/2'))).toBe(true);
    expect(cards.every((card) => card.className.includes('tw:md:grow'))).toBe(true);
    expect(
      within(carousel as HTMLElement)
        .getAllByRole('link')
        .every((link) => link.getAttribute('tabindex') === '-1'),
    ).toBe(true);
  });

  it('normalizes failed and empty API responses', async () => {
    const error = await PetTypesSectionContainer({
      petTypesPromise: Promise.resolve({
        isSuccess: false,
        message: 'ارتباط با سرور برقرار نشد.',
        data: { messages: {}, details: {} },
      }),
    });
    const empty = await PetTypesSectionContainer({
      petTypesPromise: Promise.resolve({ isSuccess: true, message: null, data: [] }),
    });
    const { rerender } = render(error);

    expect(screen.getByText('دریافت دسته‌بندی‌ها انجام نشد')).toBeTruthy();
    expect(screen.getByText('ارتباط با سرور برقرار نشد.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'دریافت دوباره اطلاعات' }));
    expect(retryAllLandingPetTypesActionMock).toHaveBeenCalledOnce();

    rerender(empty);
    expect(screen.getByText('دسته‌بندی فعالی برای نمایش وجود ندارد')).toBeTruthy();
  });
});
