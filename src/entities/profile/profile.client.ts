'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo, useState, useTransition } from 'react';

import { getProfileOrderAction, getProfileOrdersAction } from './profile.actions';
import type { ProfileOrdersPageDTO } from './profile.dto';
import { globalErrorHandler } from '@/utils/helpers';

export const profileQueryKeys = {
  all: ['profile'] as const,
  orders: () => [...profileQueryKeys.all, 'orders'] as const,
  order: (orderId: string) => [...profileQueryKeys.orders(), orderId] as const,
};

/** Manual profile-order pagination through the authenticated Server Action. */
export function useProfileOrdersPage(initialPage: ProfileOrdersPageDTO) {
  const [pages, setPages] = useState<ProfileOrdersPageDTO[]>([initialPage]);
  const [error, setError] = useState<unknown>(null);
  const [isFetchingNextPage, startTransition] = useTransition();
  const lastPage = pages.at(-1) ?? initialPage;
  const hasNextPage = lastPage.pagination.nextPage != null;

  const loadedOrders = useMemo(() => {
    const uniqueOrders = new Map<string, ProfileOrdersPageDTO['result'][number]>();
    pages.flatMap((page) => page.result).forEach((order) => uniqueOrders.set(order._id, order));
    return [...uniqueOrders.values()];
  }, [pages]);

  function fetchNextPage(): Promise<void> {
    const nextPage = lastPage.pagination.nextPage;
    if (!nextPage || isFetchingNextPage) return Promise.resolve();

    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          const page = await getProfileOrdersAction({ page: nextPage });
          setPages((currentPages) => [...currentPages, page]);
          setError(null);
        } catch (nextPageError) {
          setError(nextPageError);
        } finally {
          resolve();
        }
      });
    });
  }

  return {
    data: { pages },
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError: error !== null,
    loadedOrders,
  };
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
    queryKey: profileQueryKeys.order(orderId),
    queryFn: () => fetchProfileOrder(orderId),
    staleTime: 60_000,
  });
}
