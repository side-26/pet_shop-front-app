import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';
import type { LandingPetDTO } from '@/entities/landing/landing.dto';

import { RehomingSectionContainer } from './rehoming-section-container';
import { RehomingSectionRenderer } from './rehoming-section-renderer';
import { rehomingSectionSkeletonData } from './rehoming-section-skeleton-data';

const { retryLandingRecentPetsActionMock } = vi.hoisted(() => ({
  retryLandingRecentPetsActionMock: vi.fn(),
}));

vi.mock('@/entities/landing/landing.actions', () => ({
  retryLandingRecentPetsAction: retryLandingRecentPetsActionMock,
}));

const pet: LandingPetDTO = {
  id: 'pet-1',
  title: 'نبات',
  slug: 'nabat',
  mainImage: 'https://cdn.example.test/nabat.webp',
  mainImageThumbnail: 'data:image/webp;base64,AAAA',
  petType: 'گربه',
  breed: 'DSH',
  price: 0,
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

describe('RehomingSection', () => {
  it('renders recent API pets with their adoption-detail links', () => {
    render(<RehomingSectionRenderer pets={[pet]} />);

    expect(screen.getByAltText('تصویر نبات').getAttribute('src')).toContain(
      encodeURIComponent(pet.mainImage),
    );
    expect(screen.getByText(/گربه.*DSH/)).toBeTruthy();
    expect(screen.getByRole('link', { name: 'درخواست واگذاری نبات' }).getAttribute('href')).toBe(
      routePaths.petDetail(pet.slug),
    );
  });

  it('renders a non-interactive renderer-backed fallback skeleton', () => {
    const { container } = render(
      <RehomingSectionRenderer pets={rehomingSectionSkeletonData} isSkeleton />,
    );
    const carousel = container.firstElementChild as HTMLElement;

    expect(carousel.getAttribute('aria-busy')).toBe('true');
    expect(carousel.className).toContain('skeleton');
    expect(
      within(carousel)
        .getAllByRole('link')
        .every((link) => link.getAttribute('tabindex') === '-1'),
    ).toBe(true);
    expect(
      within(carousel)
        .getAllByRole('button')
        .every((button) => button.matches(':disabled')),
    ).toBe(true);
  });

  it('handles expected API failures, retry, and empty data', async () => {
    const error = await RehomingSectionContainer({
      petsPromise: Promise.resolve({
        isSuccess: false,
        message: 'ارتباط با سرور برقرار نشد.',
        data: { messages: {}, details: {} },
      }),
    });
    const empty = await RehomingSectionContainer({
      petsPromise: Promise.resolve({ isSuccess: true, message: null, data: [] }),
    });
    const { rerender } = render(error);

    expect(screen.getByRole('alert').textContent).toContain('ارتباط با سرور برقرار نشد.');
    fireEvent.click(screen.getByRole('button', { name: 'دریافت دوباره اطلاعات' }));
    expect(retryLandingRecentPetsActionMock).toHaveBeenCalledOnce();

    rerender(empty);
    expect(screen.getByText('حیوانی برای واگذاری وجود ندارد')).toBeTruthy();
  });
});
