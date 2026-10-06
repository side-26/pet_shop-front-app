'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getProfileOrderAction, getProfileOrdersAction } from './profile.actions';
import type { ProfileOrdersPageDTO } from './profile.dto';
import { globalErrorHandler } from '@/utils/helpers';

async function fetchProfileOrdersPage(page: number) {
  const result = await getProfileOrdersAction({ page });
  if (!result?.isSuccess) {
    const error = result ?? {
      isSuccess: false as const,
      message: 'پاسخ دریافت سفارش‌های بیشتر نامعتبر است.',
      data: { messages: {}, details: {} },
    };
    globalErrorHandler(error);
    throw new Error(error.message ?? 'دریافت سفارش‌های بیشتر انجام نشد.');
  }

  return result.data;
}

/** Manual, authenticated infinite pagination for profile orders. */
export function useProfileOrdersPage(initialPage: ProfileOrdersPageDTO) {
  const query = useInfiniteQuery({
    queryKey: ['profile', 'orders'],
    queryFn: ({ pageParam }) => fetchProfileOrdersPage(pageParam),
    initialPageParam: initialPage.pagination.currentPage,
    initialData: {
      pages: [initialPage],
      pageParams: [initialPage.pagination.currentPage],
    },
    getNextPageParam: (page) => page.pagination.nextPage ?? undefined,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const loadedOrders = useMemo(() => {
    const uniqueOrders = new Map<string, ProfileOrdersPageDTO['result'][number]>();
    query.data.pages
      .flatMap((page) => page.result)
      .forEach((order) => uniqueOrders.set(order._id, order));
    return [...uniqueOrders.values()];
  }, [query.data.pages]);

  return { ...query, loadedOrders };
}

async function fetchProfileOrder(orderId: string) {
  const result = await getProfileOrderAction({ id: orderId });

  if (!result?.isSuccess) {
    const error = result ?? {
      isSuccess: false as const,
      message: 'پاسخ جزئیات سفارش نامعتبر است.',
      data: { messages: {}, details: {} },
    };
    globalErrorHandler(error);
    throw new Error(error.message ?? 'دریافت جزئیات سفارش ناموفق بود.');
  }

  return result.data;
}

export function useGetProfileOrder(orderId: string) {
  return useQuery({
    queryKey: ['profile', 'orders', orderId],
    queryFn: () => fetchProfileOrder(orderId),
    staleTime: 60_000,
  });
}
