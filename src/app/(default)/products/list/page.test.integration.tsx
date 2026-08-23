import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { routePaths } from '@/configs/route.path';

import ProductListPage, { metadata } from './page';

afterEach(cleanup);

describe(routePaths.productsList, () => {
  it('renders the listing content, filters, products, and reusable prices', async () => {
    render(await ProductListPage());

    expect(screen.getByRole('heading', { level: 1, name: 'محصولات حیوانات خانگی' })).toBeTruthy();
    expect(screen.getByRole('navigation', { name: 'مسیر صفحه' })).toBeTruthy();
    expect(screen.getByText('محصولات').getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('complementary', { name: 'فیلتر محصولات' })).toBeTruthy();
    expect(screen.queryByText('برای دوست کوچکت، بهترین را انتخاب کن')).toBeNull();
    expect(screen.queryByText(/محصول منتخب برای تغذیه، بازی و مراقبت/)).toBeNull();
    expect(
      screen.queryByText('انتخاب‌ها را برای رسیدن سریع‌تر به محصول مناسب محدود کنید.'),
    ).toBeNull();
    expect(screen.getAllByRole('heading', { level: 3 }).length).toBeGreaterThan(4);
    expect(screen.getAllByText('تومان').length).toBeGreaterThan(4);
    expect(screen.getByRole('button', { name: 'مشاهده محصولات بیشتر' })).toBeTruthy();
    expect(screen.getByText('ناموجود')).toBeTruthy();
    expect(screen.queryByRole('textbox', { name: 'جستجو در فهرست محصولات' })).toBeNull();
  });

  it('lets shoppers collapse each filter group', async () => {
    render(await ProductListPage());

    const animalTypeTrigger = screen.getByRole('button', { name: 'نوع حیوان' });
    const categoryTrigger = screen.getByRole('button', { name: 'دسته‌بندی' });

    expect(animalTypeTrigger.getAttribute('aria-expanded')).toBe('true');
    expect(categoryTrigger.getAttribute('aria-expanded')).toBe('true');

    fireEvent.click(animalTypeTrigger);

    expect(animalTypeTrigger.getAttribute('aria-expanded')).toBe('false');
    expect(categoryTrigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('defines route metadata while keeping the page server-rendered', () => {
    expect(metadata.title).toBe('فهرست محصولات حیوانات خانگی | پناهگاه پرشین');
  });
});
