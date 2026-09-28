import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';

import CartPage, { metadata } from './page';
import { CartPageContent } from './_components/cart-page-content';
import type { CartItem } from './_components/cart-data';

vi.mock('nextjs-toploader/app', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

afterEach(cleanup);

const cartItems: readonly CartItem[] = [
  {
    id: 'cart-item-1',
    title: 'غذای خشک سگ مدل رویال کنین Maxi Adult',
    image: '/images/product-placeholder.webp',
    detail: '۲ کیلوگرم',
    price: 800_000,
    quantity: 1,
    stock: 5,
    cartItem: {
      type: 'product',
      productId: 'product-1',
      cartEntryId: 'cart-item-1',
      quantity: 1,
      weight: {
        id: 'weight-1',
        value: 2,
        metric: 'کیلوگرم',
        quantity: 5,
        price: 800_000,
        discountPercentage: 0,
      },
    },
  },
];

describe(routePaths.cart, () => {
  it('renders the responsive cart content and order summary for a populated cart', () => {
    const { container } = render(<CartPageContent initialItems={cartItems} />);

    expect(container.querySelector('main')).toBeNull();
    expect(screen.getByRole('heading', { level: 1, name: 'سبد خرید' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'خلاصه سفارش' })).toBeTruthy();
    expect(screen.getAllByRole('group', { name: /تعداد/ })).toHaveLength(1);
    expect(
      screen
        .getByRole('group', { name: 'تعداد غذای خشک سگ مدل رویال کنین Maxi Adult' })
        .querySelector('output')?.textContent,
    ).toBe('۱');
    expect(screen.queryByText('کد تخفیف دارید؟')).toBeNull();
    expect(screen.queryByText('۴ کالا برای ادامه خرید آماده است.')).toBeNull();
    expect(screen.queryByText('تخفیف دارد')).toBeNull();
    expect(screen.queryByText('موجود در انبار')).toBeNull();
    expect(screen.getByRole('button', { name: /ادامه خرید/ }).getAttribute('href')).toBe(
      routePaths.productsList,
    );
  });

  it('hides the order-summary sidebar for an empty cart', () => {
    render(<CartPageContent initialItems={[]} />);

    expect(screen.getByRole('heading', { name: 'سبد خرید شما خالی است' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'خلاصه سفارش' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'ادامه فرایند خرید' })).toBeNull();
  });

  it('renders a disabled skeleton instead of the empty state while cart data is loading', () => {
    const { container } = render(<CartPageContent isSkeleton />);

    expect(container.querySelector('.skeleton')).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'سبد خرید شما خالی است' })).toBeNull();
    expect(container.querySelector('[data-cart-page] [aria-busy="true"]')).toBeTruthy();
  });

  it('asks for confirmation before removing a cart item', () => {
    render(<CartPageContent initialItems={cartItems} />);

    fireEvent.click(
      screen.getByRole('button', {
        name: 'حذف کالا از سبد خرید: غذای خشک سگ مدل رویال کنین Maxi Adult',
      }),
    );

    expect(screen.getByRole('heading', { name: 'حذف کالا از سبد خرید' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'حذف کالا' })).toBeTruthy();
  });

  it('defines cart metadata', () => {
    expect(metadata.title).toBe('سبد خرید | پت شاپ پرشین');
  });
});
