import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import { retryLandingProductDetailAction } from '@/entities/landing/landing.actions';
import { updateProductUserRateAction } from '@/entities/products/products.actions';

import { ProductRatingForm } from './product-rating-form';

vi.mock('@/entities/products/products.actions', () => ({ updateProductUserRateAction: vi.fn() }));
vi.mock('@/entities/landing/landing.actions', () => ({ retryLandingProductDetailAction: vi.fn() }));

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(updateProductUserRateAction).mockResolvedValue({
    isSuccess: true,
    message: 'امتیاز ثبت شد',
    data: { userRate: 4, userRateCount: 1 },
  });
});

afterEach(cleanup);

it('submits the eligible customer rating and refreshes the slug detail', async () => {
  render(
    <ProductRatingForm
      productId="6a9fcb6871b632040de16436"
      slug="product-0de16436"
      canVote
      hasRated={false}
    />,
  );

  fireEvent.click(screen.getByRole('button', { name: '4 ستاره' }));
  fireEvent.click(screen.getByRole('button', { name: 'ثبت امتیاز' }));

  await waitFor(() =>
    expect(updateProductUserRateAction).toHaveBeenCalledWith({
      id: '6a9fcb6871b632040de16436',
      userRate: 4,
    }),
  );
  expect(retryLandingProductDetailAction).toHaveBeenCalledWith('product-0de16436');
  expect(screen.getByText('امتیاز شما برای این محصول ثبت شده است.')).toBeTruthy();
});

it('explains the API eligibility limit without rendering a form', () => {
  render(
    <ProductRatingForm
      productId="6a9fcb6871b632040de16436"
      slug="product-0de16436"
      canVote={false}
      hasRated={false}
    />,
  );

  expect(screen.getByText(/مشتریانی فعال است که این محصول را خریداری/)).toBeTruthy();
  expect(screen.queryByRole('form')).toBeNull();
});
