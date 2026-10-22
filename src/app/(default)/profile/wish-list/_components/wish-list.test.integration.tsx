import { DirectionProvider } from '@base-ui/react/direction-provider';
import { act, cleanup, render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { LandingWishlistItemDTO } from '@/entities/landing/landing.dto';

import { WishListContent } from './wish-list-content';
import { WishListErrorBoundary } from './wish-list-error-boundary';
import { WishListRenderer } from './wish-list-renderer';
import { wishListSkeletonData } from './wish-list-skeleton-data';

afterEach(cleanup);

const wishList: LandingWishlistItemDTO[] = [
  {
    id: 'wish-1',
    itemType: 'product',
    item: {
      id: 'product-1',
      title: 'غذای کامل گربه بالغ با طعم مرغ',
      mainImage: 'https://cdn.example.com/cat-food.webp',
      mainImageThumbnail: 'data:image/webp;base64,AAAA',
      price: 200_000,
      discountPercentage: 0,
      discountPrice: 0,
      slug: 'cat-food',
    },
  },
];

function FailedWishListContent(): never {
  throw new Error('دریافت علاقه‌مندی‌ها با مشکل روبه‌رو شد.');
}

describe('WishList content', () => {
  it('uses the Item grid for loaded items and leaves removal disabled', () => {
    render(
      <DirectionProvider direction="rtl">
        <WishListRenderer
          items={[
            {
              id: 'wish-1',
              itemType: 'product',
              title: 'غذای کامل گربه بالغ با طعم مرغ',
              mainImage: 'https://cdn.example.com/cat-food.webp',
              thumbnailImage: 'data:image/webp;base64,AAAA',
            },
          ]}
        />
      </DirectionProvider>,
    );

    expect(screen.getByRole('list', { name: 'فهرست علاقه‌مندی‌ها' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'غذای کامل گربه بالغ با طعم مرغ' })).toBeTruthy();
    expect(
      screen
        .getByRole('button', { name: 'حذف غذای کامل گربه بالغ با طعم مرغ از علاقه‌مندی‌ها' })
        .matches(':disabled'),
    ).toBe(true);
  });

  it('renders a busy, non-interactive Item skeleton with the same grid layout', () => {
    render(
      <DirectionProvider direction="rtl">
        <WishListRenderer items={wishListSkeletonData} isSkeleton />
      </DirectionProvider>,
    );

    const grid = screen.getByRole('list', { name: 'فهرست علاقه‌مندی‌ها' });
    expect(grid.getAttribute('aria-busy')).toBe('true');
    expect(grid.className).toContain('skeleton');
    expect(grid.className).toContain('tw:pointer-events-none');
    expect(screen.getAllByRole('button').every((button) => button.matches(':disabled'))).toBe(true);
  });

  it('selects the semantic empty fallback for an empty wishlist', async () => {
    await act(async () => {
      render(
        <DirectionProvider direction="rtl">
          <Suspense fallback={null}>
            <WishListContent wishListPromise={Promise.resolve([])} />
          </Suspense>
        </DirectionProvider>,
      );
    });

    expect(screen.getByText('هنوز علاقه‌مندی‌ای ندارید')).toBeTruthy();
  });

  it('renders the user-safe error message from the error boundary', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <WishListErrorBoundary>
        <FailedWishListContent />
      </WishListErrorBoundary>,
    );

    expect(screen.getByRole('alert').textContent).toContain('دریافت علاقه‌مندی‌ها انجام نشد');
    expect(screen.getByRole('alert').textContent).toContain(
      'دریافت علاقه‌مندی‌ها با مشکل روبه‌رو شد.',
    );
    consoleError.mockRestore();
  });

  it('maps a populated Server Action result into the item renderer', async () => {
    await act(async () => {
      render(
        <DirectionProvider direction="rtl">
          <Suspense fallback={null}>
            <WishListContent wishListPromise={Promise.resolve(wishList)} />
          </Suspense>
        </DirectionProvider>,
      );
    });

    expect(screen.getByRole('heading', { name: wishList[0]?.item.title })).toBeTruthy();
  });
});
