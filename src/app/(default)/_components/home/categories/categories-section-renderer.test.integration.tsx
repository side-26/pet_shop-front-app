import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { animatedStaggeredListItemClassName } from '@/components/common/staggered-list';

import { CategoriesSectionRenderer } from './categories-section-renderer';

vi.mock('@/components/common/pet-types-carousel-section', () => ({
  PetTypesCarouselSection: ({
    isLoading,
    itemClassName,
    petTypes,
  }: {
    isLoading: boolean;
    itemClassName?: string;
    petTypes: Array<{ id: string; title: string }>;
  }) => (
    <div aria-busy={isLoading || undefined} aria-label="دسته‌بندی حیوانات" role="region">
      {petTypes.map((petType) => (
        <article key={petType.id} className={itemClassName}>
          {petType.title}
        </article>
      ))}
    </div>
  ),
}));

afterEach(cleanup);

describe('CategoriesSectionRenderer', () => {
  const petTypes = [
    { id: 'cat', title: 'گربه‌ها', mainImage: '/cat.jpg', thumbnail: '/cat-thumb.jpg' },
  ];

  it('uses the same renderer for skeleton data and disables its carousel state', () => {
    render(<CategoriesSectionRenderer petTypes={petTypes} isSkeleton />);

    expect(
      screen.getByRole('region', { name: 'دسته‌بندی حیوانات' }).getAttribute('aria-busy'),
    ).toBe('true');
    expect(screen.getByText('گربه‌ها').className).toContain(animatedStaggeredListItemClassName);
  });

  it('renders populated pet types through staggered carousel items', () => {
    render(<CategoriesSectionRenderer petTypes={petTypes} />);

    expect(
      screen.getByRole('region', { name: 'دسته‌بندی حیوانات' }).getAttribute('aria-busy'),
    ).toBe(null);
    expect(screen.getByText('گربه‌ها').className).toContain(animatedStaggeredListItemClassName);
  });
});
