import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { routePaths } from '@/configs/route.path';

import PetListPage, { metadata } from './page';

afterEach(cleanup);

describe(routePaths.petsList, () => {
  it('renders the RTL pet listing and desktop filter composition', () => {
    render(<PetListPage />);
    expect(screen.getByRole('heading', { level: 1, name: 'حیوانات دوست‌داشتنی' })).toBeTruthy();
    expect(screen.getByRole('navigation', { name: 'مسیر صفحه' })).toBeTruthy();
    expect(screen.getByRole('complementary', { name: 'فیلتر حیوانات' })).toBeTruthy();
    expect(screen.getAllByRole('heading', { level: 3 }).length).toBeGreaterThan(6);
    expect(screen.getByTestId('pets-grid').className).toContain('tw:md:grid-cols-3');
    expect(screen.getAllByText('واگذار شده')).toHaveLength(2);
  });

  it('exposes mobile and tablet filters and sorting as dialog actions', () => {
    render(<PetListPage />);
    expect(screen.getByRole('button', { name: 'فیلترها' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'مرتب‌سازی' })).toBeTruthy();
  });

  it('defines route metadata while keeping the page server-rendered', () => {
    expect(metadata.title).toBe('فهرست حیوانات خانگی | پناهگاه پرشین');
  });
});
