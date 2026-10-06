import { createElement, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import { updateProductUserRateAction } from '@/entities/products/products.actions';

import { ProductRatingForm } from './product-rating-form';

vi.mock('@/entities/products/products.actions', () => ({ updateProductUserRateAction: vi.fn() }));

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(updateProductUserRateAction).mockResolvedValue({
    isSuccess: true,
    message: 'امتیاز ثبت شد',
    data: { userRate: 4, userRateCount: 1 },
  });
});

afterEach(cleanup);

function renderWithQueryClient(children: ReactNode) {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return render(createElement(QueryClientProvider, { client: queryClient }, children));
}

it('submits the eligible customer rating without refreshing the product detail', async () => {
  renderWithQueryClient(
    <ProductRatingForm productId="6a9fcb6871b632040de16436" canVote hasRated={false} />,
  );

  fireEvent.click(screen.getByRole('button', { name: '4 ستاره' }));
  fireEvent.click(screen.getByRole('button', { name: 'ثبت امتیاز' }));

  await waitFor(() =>
    expect(updateProductUserRateAction).toHaveBeenCalledWith({
      id: '6a9fcb6871b632040de16436',
      userRate: 4,
    }),
  );
  expect(screen.getByText('امتیاز شما برای این محصول ثبت شده است.')).toBeTruthy();
});

it('explains the API eligibility limit without rendering a form', () => {
  renderWithQueryClient(
    <ProductRatingForm productId="6a9fcb6871b632040de16436" canVote={false} hasRated={false} />,
  );

  expect(screen.getByText(/مشتریانی فعال است که این محصول را خریداری/)).toBeTruthy();
  expect(screen.queryByRole('form')).toBeNull();
});
