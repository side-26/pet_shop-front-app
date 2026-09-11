import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';
import type { LandingPetDTO } from '@/entities/landing/landing.dto';

import { PopularPetsSectionContainer } from './popular-pets-section-container';
import { PopularPetsSectionRenderer } from './popular-pets-section-renderer';
import { popularPetsSectionSkeletonData } from './popular-pets-section-skeleton-data';

const { retryLandingPopularPetsActionMock } = vi.hoisted(() => ({
  retryLandingPopularPetsActionMock: vi.fn(),
}));

vi.mock('@/entities/landing/landing.actions', () => ({
  retryLandingPopularPetsAction: retryLandingPopularPetsActionMock,
}));

const pet: LandingPetDTO = {
  id: 'pet-1',
  title: 'مکس',
  slug: 'max',
  mainImage: 'https://cdn.example.test/max.webp',
  mainImageThumbnail: 'data:image/webp;base64,AAAA',
  petType: 'سگ',
  breed: 'گلدن رتریور',
  price: 15_000_000,
};

beforeEach(() => {
  window.matchMedia = vi
    .fn()
    .mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() });
  vi.stubGlobal(
    'IntersectionObserver',
    class IntersectionObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
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

describe('PopularPetsSection', () => {
  it('renders API pet fields, thumbnail image, and detail link', () => {
    render(<PopularPetsSectionRenderer pets={[pet]} />);

    const [image] = screen.getAllByAltText('مکس، سگ');
    expect(image.getAttribute('src')).toContain(encodeURIComponent(pet.mainImage));
    expect(screen.getAllByText(pet.petType)).toHaveLength(2);
    expect(screen.getAllByText(pet.breed)).toHaveLength(2);
    expect(document.querySelector('[data-slot="card-description"]')?.className).toContain(
      'tw:pb-3',
    );
    expect(document.querySelector('[data-slot="card-description"]')?.className).toContain(
      'tw:text-caption',
    );
    expect(
      screen
        .getAllByRole('link', { name: 'مشاهده مکس' })
        .every((link) => link.getAttribute('href') === routePaths.petDetail(pet.slug)),
    ).toBe(true);
  });

  it('renders a non-interactive renderer-backed fallback skeleton', () => {
    const { container } = render(
      <PopularPetsSectionRenderer pets={popularPetsSectionSkeletonData} isSkeleton />,
    );

    const section = container.firstElementChild;
    expect(section?.getAttribute('aria-busy')).toBe('true');
    expect(section?.className).toContain('skeleton');
    expect(
      within(section as HTMLElement)
        .getAllByRole('link')
        .every((link) => link.getAttribute('tabindex') === '-1'),
    ).toBe(true);
    expect(
      within(section as HTMLElement)
        .getAllByRole('group')
        .every((item) => item.className.includes('tw:basis-1/2')),
    ).toBe(true);
  });

  it('normalizes failed and empty API responses', async () => {
    const error = await PopularPetsSectionContainer({
      petsPromise: Promise.resolve({
        isSuccess: false,
        message: 'ارتباط با سرور برقرار نشد.',
        data: { messages: {}, details: {} },
      }),
    });
    const empty = await PopularPetsSectionContainer({
      petsPromise: Promise.resolve({ isSuccess: true, message: null, data: [] }),
    });
    const { rerender } = render(error);

    expect(screen.getByText('دریافت حیوانات پرطرفدار انجام نشد')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'دریافت دوباره اطلاعات' }));
    expect(retryLandingPopularPetsActionMock).toHaveBeenCalledOnce();
    rerender(empty);
    expect(screen.getByText('حیوان پرطرفداری برای نمایش وجود ندارد')).toBeTruthy();
  });
});
