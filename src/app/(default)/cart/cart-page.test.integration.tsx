import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { routePaths } from '@/configs/route.path';

import CartPage, { metadata } from './page';

afterEach(cleanup);

describe(routePaths.cart, () => {
  it('renders the responsive cart content and order summary', () => {
    const { container } = render(<CartPage />);

    expect(container.querySelector('main')).toBeNull();
    expect(screen.getByRole('heading', { level: 1, name: 'سبد خرید' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'خلاصه سفارش' })).toBeTruthy();
    expect(screen.getAllByRole('group', { name: /تعداد/ })).toHaveLength(3);
    expect(screen.queryByText('کد تخفیف دارید؟')).toBeNull();
    expect(screen.queryByText('۴ کالا برای ادامه خرید آماده است.')).toBeNull();
    expect(screen.getByRole('button', { name: /ادامه خرید/ }).getAttribute('href')).toBe(
      routePaths.productsList,
    );
  });

  it('updates quantity totals and removes a line without leaving the page', async () => {
    render(<CartPage />);

    const firstCounter = screen.getByRole('group', {
      name: 'تعداد غذای خشک سگ مدل رویال کنین Maxi Adult',
    });
    fireEvent.click(firstCounter.querySelector('[aria-label="افزایش مقدار"]') as HTMLElement);
    await waitFor(() => expect(firstCounter.querySelector('output')?.textContent).toBe('۲'));

    fireEvent.click(firstCounter.querySelector('[aria-label="کاهش مقدار"]') as HTMLElement);
    await waitFor(() => expect(firstCounter.querySelector('output')?.textContent).toBe('۱'));

    fireEvent.click(
      screen.getByRole('button', { name: 'حذف غذای خشک سگ مدل رویال کنین Maxi Adult' }),
    );
    expect(screen.queryByText('غذای خشک سگ مدل رویال کنین Maxi Adult')).toBeNull();
  });

  it('defines cart metadata', () => {
    expect(metadata.title).toBe('سبد خرید | پناهگاه پرشین');
  });
});
