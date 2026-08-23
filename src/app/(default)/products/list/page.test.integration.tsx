import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { routePaths } from '@/configs/route.path';

import ProductListPage, { metadata } from './page';

afterEach(cleanup);

describe(routePaths.productsList, () => {
  it('renders the listing content, filters, products, and reusable prices', async () => {
    render(await ProductListPage());

    expect(screen.getByRole('heading', { level: 1, name: 'محصولات حیوانات خانگی' })).toBeTruthy();
    expect(screen.getByRole('complementary', { name: 'فیلتر محصولات' })).toBeTruthy();
    expect(screen.getAllByRole('heading', { level: 3 }).length).toBeGreaterThan(4);
    expect(screen.getAllByText('تومان').length).toBeGreaterThan(4);
    expect(screen.getByRole('button', { name: 'مشاهده محصولات بیشتر' })).toBeTruthy();
    expect(screen.getByText('ناموجود')).toBeTruthy();
    expect(screen.queryByRole('textbox', { name: 'جستجو در فهرست محصولات' })).toBeNull();
  });

  it('defines route metadata while keeping the page server-rendered', () => {
    expect(metadata.title).toBe('فهرست محصولات حیوانات خانگی | پناهگاه پرشین');
  });
});
