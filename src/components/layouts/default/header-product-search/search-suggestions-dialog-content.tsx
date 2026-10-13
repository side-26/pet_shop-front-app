'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Search, X } from 'lucide-react';
import { Suspense, useState, type ReactNode } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EmptyStateBoundary } from '@/components/ui/empty-state-boundary';
import { ErrorStateBoundary } from '@/components/ui/error-state-boundary';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/fields/input-group';
import { Form } from '@/components/ui/form';
import { useSuspenseLandingSearchInfiniteQuery } from '@/entities/landing/landing.client';
import type { LandingSearchResultDTO } from '@/entities/landing/landing.dto';
import { useDebounce } from '@/hooks/use-debounce';

import { HeaderProductSearchEmptyFallback } from './header-product-search-empty-fallback';
import { HeaderProductSearchErrorFallback } from './header-product-search-error-fallback';
import { HeaderProductSearchSuggestionItemGroup } from './suggestion-item-group';

const scrollableTargetId = 'header-product-search-results-dialog-scroll';

type HeaderProductSearchSuggestionsDialogContentProps = Readonly<{
  initialSuggestions: LandingSearchResultDTO[];
  onClose: () => void;
  open: boolean;
  query: string;
}>;

export function HeaderProductSearchSuggestionsDialogContent({
  initialSuggestions,
  onClose,
  open,
  query,
}: HeaderProductSearchSuggestionsDialogContentProps) {
  const [search, setSearch] = useState(query);
  const debouncedSearch = useDebounce(search);
  const normalizedSearch = search.trim();
  const normalizedDebouncedSearch = debouncedSearch.trim();
  const isDebouncing = Boolean(normalizedSearch) && normalizedSearch !== normalizedDebouncedSearch;
  const initialSuggestionsFallback =
    normalizedDebouncedSearch === query.trim() ? (
      <HeaderProductSearchSuggestionItemGroup data={initialSuggestions} />
    ) : (
      <HeaderProductSearchSuggestionItemGroup isSkeleton />
    );

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent
        size="xl"
        className="tw:flex tw:max-h-[calc(100svh-2rem)] tw:flex-col tw:gap-0 tw:overflow-hidden tw:p-0"
      >
        <DialogHeader className="tw:flex-none tw:border-b tw:border-border tw:px-6 tw:py-4">
          <DialogTitle>نتایج جستجو</DialogTitle>
          <DialogDescription>نتایج مرتبط با «{normalizedSearch}»</DialogDescription>
        </DialogHeader>
        <Form
          handleSubmit={() => undefined}
          className="tw:flex-none tw:border-b tw:border-border tw:p-4"
        >
          <InputGroup className="tw:h-11 tw:border-border/70 tw:bg-muted/75 tw:shadow-none">
            <InputGroupAddon>
              <Search aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              value={search}
              autoFocus
              aria-label="جستجو سریع"
              placeholder="جستجو سریع..."
              onChange={(event) => setSearch(event.target.value)}
              className="tw:[&::-webkit-search-cancel-button]:hidden"
            />
            {search ? (
              <InputGroupAddon className="tw:px-1.5">
                <Button
                  type="button"
                  iconOnly
                  size="sm"
                  variant="flat"
                  color="secondary"
                  aria-label="پاک کردن جستجو"
                  onClick={() => setSearch('')}
                >
                  <X aria-hidden="true" />
                </Button>
              </InputGroupAddon>
            ) : null}
          </InputGroup>
        </Form>
        <div id={scrollableTargetId} className="tw:min-h-0 tw:flex-auto tw:overflow-y-auto">
          <HeaderProductSearchSuggestionsDialogSearchResults
            initialSuggestionsFallback={initialSuggestionsFallback}
            isDebouncing={isDebouncing}
            query={normalizedDebouncedSearch}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

type HeaderProductSearchSuggestionsDialogSearchResultsProps = Readonly<{
  initialSuggestionsFallback: ReactNode;
  isDebouncing: boolean;
  query: string;
}>;

function HeaderProductSearchSuggestionsDialogSearchResults({
  initialSuggestionsFallback,
  isDebouncing,
  query,
}: HeaderProductSearchSuggestionsDialogSearchResultsProps) {
  if (!query)
    return (
      <HeaderProductSearchEmptyFallback description="برای دیدن نتایج، نام آیتم را وارد کنید." />
    );

  if (isDebouncing) return <HeaderProductSearchSuggestionItemGroup isSkeleton />;

  return (
    <QueryErrorResetBoundary>
      <ErrorStateBoundary fallback={<HeaderProductSearchErrorFallback />}>
        <Suspense fallback={initialSuggestionsFallback}>
          <HeaderProductSearchSuggestionsDialogResults query={query} />
        </Suspense>
      </ErrorStateBoundary>
    </QueryErrorResetBoundary>
  );
}

function HeaderProductSearchSuggestionsDialogResults({ query }: Readonly<{ query: string }>) {
  const { error, fetchNextPage, hasNextPage, suggestions } = useSuspenseLandingSearchInfiniteQuery({
    search: query,
    limit: 20,
  });

  return (
    <EmptyStateBoundary
      data={suggestions}
      fallback={
        <HeaderProductSearchEmptyFallback
          description={`برای «${query}» آیتمی پیدا نشد. عبارت دیگری را امتحان کنید.`}
        />
      }
    >
      <InfiniteScroll
        dataLength={suggestions.length}
        hasMore={hasNextPage ?? false}
        loader={<HeaderProductSearchSuggestionItemGroup isSkeleton />}
        next={() => void fetchNextPage()}
        scrollableTarget={scrollableTargetId}
      >
        <HeaderProductSearchSuggestionItemGroup data={suggestions} />
        {error ? <HeaderProductSearchErrorFallback /> : null}
      </InfiniteScroll>
    </EmptyStateBoundary>
  );
}
