'use client';

import { Suspense } from 'react';

import { Button } from '@/components/ui/button';
import { EmptyStateBoundary } from '@/components/ui/empty-state-boundary';
import { ErrorStateBoundary } from '@/components/ui/error-state-boundary';
import { useSuspenseLandingSearchQuery } from '@/entities/landing/landing.client';

import { HeaderProductSearchEmptyFallback } from './header-product-search-empty-fallback';
import { useHeaderProductSearchContext } from './header-product-search-context';
import { HeaderProductSearchErrorFallback } from './header-product-search-error-fallback';
import { HeaderProductSearchSuggestionItemGroup } from './suggestion-item-group';

type HeaderProductSearchResultsStreamProps = Readonly<{ query: string }>;

export function HeaderProductSearchResultsStream({ query }: HeaderProductSearchResultsStreamProps) {
  return (
    <ErrorStateBoundary fallback={<HeaderProductSearchErrorFallback />}>
      <Suspense fallback={<HeaderProductSearchResultsSkeleton />}>
        <HeaderProductSearchResults query={query} />
      </Suspense>
    </ErrorStateBoundary>
  );
}

function HeaderProductSearchResults({ query }: HeaderProductSearchResultsStreamProps) {
  const { data: suggestions } = useSuspenseLandingSearchQuery({
    search: query,
    page: 1,
    limit: 3,
  });
  const { openSearchSuggestionsDialog } = useHeaderProductSearchContext();

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
        <Button
          type="button"
          block
          color="secondary"
          size="sm"
          variant="outlined"
          className="tw:mt-2"
          onClick={() => openSearchSuggestionsDialog({ initialSuggestions: suggestions, query })}
        >
          مشاهده بیشتر
        </Button>
      </section>
    </EmptyStateBoundary>
  );
}

function HeaderProductSearchResultsSkeleton() {
  return <HeaderProductSearchSuggestionItemGroup isSkeleton />;
}
