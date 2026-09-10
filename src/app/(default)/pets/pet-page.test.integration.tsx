import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';

import PetLandingPage from './page';

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

describe('Pet landing page', () => {
  it('matches the synchronized Stitch content hierarchy', () => {
    render(<PetLandingPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'بهترین دوست خود را پیدا کنید' }),
    ).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'دسته‌بندی حیوانات' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'پرطرفدارترین حیوانات' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'حیوانات آماده واگذاری' })).toBeTruthy();

    for (const name of ['فندق', 'نبات', 'طوطی', 'پیکو']) {
      expect(screen.getByRole('heading', { name })).toBeTruthy();
    }
    for (const name of ['حیوان اول', 'حیوان دوم', 'حیوان سوم', 'حیوان چهارم']) {
      expect(screen.getAllByRole('heading', { name })).toHaveLength(2);
    }
  });

  it('uses a non-interactive category skeleton and an accessible RTL adoption carousel', () => {
    render(<PetLandingPage />);

    expect(screen.getByRole('link', { name: /شروع جستجو/ }).getAttribute('href')).toBe(
      routePaths.petsList,
    );
    const petTypesSection = document.getElementById('pet-types');
    if (!petTypesSection) throw new Error('Pet types section was not rendered.');
    const petTypesSkeleton = petTypesSection.querySelector('[aria-roledescription="carousel"]');
    expect(petTypesSkeleton).toBeTruthy();
    expect(
      within(petTypesSkeleton as HTMLElement)
        .getAllByRole('link')
        .every((link) => link.getAttribute('tabindex') === '-1'),
    ).toBe(true);
    const popularPetsSection = screen
      .getByRole('heading', { name: 'پرطرفدارترین حیوانات' })
      .closest('section');
    if (!popularPetsSection) throw new Error('Popular pets section was not rendered.');
    const popularPetsCarousel = within(popularPetsSection).getByRole('region', {
      name: 'حیوانات پرطرفدار',
    });
    const popularPetsFallback = popularPetsSection.querySelector('[aria-busy="true"]');
    if (!popularPetsFallback) throw new Error('Popular pets fallback was not rendered.');
    expect(within(popularPetsCarousel).getAllByRole('group')).toHaveLength(4);
    expect(
      within(popularPetsFallback as HTMLElement)
        .getAllByRole('link')
        .every((link) => link.getAttribute('tabindex') === '-1'),
    ).toBe(true);

    const carousel = screen
      .getAllByRole('region', { name: 'حیوانات آماده واگذاری' })
      .find((region) => region.getAttribute('aria-roledescription') === 'carousel');
    expect(carousel).toBeTruthy();
    if (!carousel) return;
    expect(carousel.getAttribute('aria-roledescription')).toBe('carousel');
    expect(carousel.getAttribute('dir')).toBe('rtl');
    expect(within(carousel).getAllByRole('group')).toHaveLength(4);
  });
});
