'use client';

import { useRouter } from '@/hooks/use-router';

import { routePaths } from '@/configs/route.path';
import {
  createPaginationRangeFilterHref,
  createPaginationSingleFilterHref,
  createPaginationSortHref,
} from '@/entities/pagination/pagination.helpers';

export function useArticleCatalogControls(query: Readonly<Record<string, string>>) {
  const router = useRouter();

  const changeSort = (sort: string) =>
    router.push(createPaginationSortHref(routePaths.articles, query, sort), { scroll: false });
  const toggleTag = (tag: string) =>
    router.push(createPaginationRangeFilterHref(routePaths.articles, query, 'tags', tag), {
      scroll: false,
    });
  const changePetType = (petType?: string) =>
    router.push(createPaginationSingleFilterHref(routePaths.articles, query, 'petType', petType), {
      scroll: false,
    });

  return { changePetType, changeSort, toggleTag };
}
