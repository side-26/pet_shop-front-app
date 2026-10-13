'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { EmptyStateBoundary } from '@/components/ui/empty-state-boundary';
import { ErrorStateBoundary } from '@/components/ui/error-state-boundary';
import { routePaths } from '@/configs/route.path';
import { useSuspenseLandingSearchQuery } from '@/entities/landing/landing.client';
import { cn } from '@/lib/utils';

import { HeaderProductSearchEmptyFallback } from './header-product-search-empty-fallback';
import { useHeaderProductSearchContext } from './header-product-search-context';
import { HeaderProductSearchErrorFallback } from './header-product-search-error-fallback';
import { HeaderProductSearchSuggestionItemGroup } from './suggestion-item-group';

type HeaderProductSearchResultsStreamProps = Readonly<{ query: string }>;

export function HeaderProductSearchResultsStream({ query }: HeaderProductSearchResultsStreamProps) {
  return (
    <QueryErrorResetBoundary>
      <ErrorStateBoundary fallback={<HeaderProductSearchErrorFallback />}>
        <Suspense fallback={<HeaderProductSearchResultsSkeleton />}>
          <HeaderProductSearchResults query={query} />
        </Suspense>
      </ErrorStateBoundary>
    </QueryErrorResetBoundary>
  );
}

function HeaderProductSearchResults({ query }: HeaderProductSearchResultsStreamProps) {
  const { data: suggestions } = useSuspenseLandingSearchQuery({
    search: query,
    page: 1,
    limit: 3,
  });
  const { onCloseHoverCard } = useHeaderProductSearchContext();

  return (
    <EmptyStateBoundary
      data={suggestions}
      fallback={
        <HeaderProductSearchEmptyFallback
          description={`برای «${query}» آیتمی پیدا نشد. عبارت دیگری را امتحان کنید.`}
        />
      }
    >
      <section aria-labelledby="search-suggestions-heading" className="tw:flex tw:flex-col tw:p-3">
        <h2
          id="search-suggestions-heading"
          className="tw:px-2 tw:py-1 tw:text-label-m tw:text-muted-foreground"
        >
          پیشنهادهای جستجو
        </h2>
        <HeaderProductSearchSuggestionItemGroup data={suggestions} />
        <Link
          href={routePaths.productsSearch(query)}
          prefetch
          onClick={onCloseHoverCard}
          className={cn(
            buttonVariants({ block: true, color: 'secondary', size: 'sm', variant: 'outlined' }),
            'tw:mt-2',
          )}
        >
          <Search data-icon="inline-start" aria-hidden="true" />
          مشاهده بیشتر
        </Link>
      </section>
    </EmptyStateBoundary>
  );
}

function HeaderProductSearchResultsSkeleton() {
  return <HeaderProductSearchSuggestionItemGroup isSkeleton />;
}
