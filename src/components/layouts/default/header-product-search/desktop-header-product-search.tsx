'use client';

import { Search, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/fields/input-group';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Spinner } from '@/components/ui/spinner';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';

import { HeaderProductSearchEmptyFallback } from './header-product-search-empty-fallback';
import { HeaderProductSearchProvider } from './header-product-search-context';
import { HeaderProductSearchResultsStream } from './header-product-search-results-stream';

type DesktopHeaderProductSearchProps = Readonly<{
  className?: string;
}>;

export function DesktopHeaderProductSearch({ className }: DesktopHeaderProductSearchProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query);

  return (
    <HeaderProductSearchProvider onCloseHoverCard={() => setOpen(false)}>
      <div className={cn('tw:min-w-0 tw:w-full tw:lg:w-72', className)}>
        <HoverCard open={open} onOpenChange={setOpen}>
          <HoverCardTrigger delay={0} closeDelay={180} render={<div className="tw:w-full" />}>
            <SearchForm
              query={query}
              onQueryChange={setQuery}
              onFocus={() => setOpen(true)}
              onClear={() => setQuery('')}
            />
          </HoverCardTrigger>
          <HoverCardContent
            align="start"
            side="bottom"
            sideOffset={8}
            className="tw:w-112 tw:max-w-[calc(100vw-2rem)] tw:p-0"
          >
            <SearchPanelContent query={query} debouncedQuery={debouncedQuery} />
          </HoverCardContent>
        </HoverCard>
      </div>
    </HeaderProductSearchProvider>
  );
}

type SearchFormProps = Readonly<{
  query: string;
  onQueryChange: (value: string) => void;
  onClear: () => void;
  onFocus: () => void;
}>;

function SearchForm({ query, onQueryChange, onClear, onFocus }: SearchFormProps) {
  return (
    <InputGroup className="tw:h-11 tw:border-border/70 tw:bg-muted/75 tw:shadow-none">
      <InputGroupAddon>
        <Search aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        value={query}
        aria-label="جستجو سریع"
        placeholder="جستجو سریع..."
        autoComplete="off"
        onFocus={onFocus}
        onChange={(event) => onQueryChange(event.target.value)}
        className="tw:text-body-s tw:[&::-webkit-search-cancel-button]:hidden"
      />
      {query ? (
        <InputGroupAddon className="tw:px-1.5">
          <Button
            type="button"
            iconOnly
            size="sm"
            variant="flat"
            color="secondary"
            aria-label="پاک کردن جستجو"
            onClick={onClear}
          >
            <X aria-hidden="true" />
          </Button>
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  );
}

type SearchPanelContentProps = Readonly<{
  query: string;
  debouncedQuery: string;
}>;

function SearchPanelContent({ query, debouncedQuery }: SearchPanelContentProps) {
  const normalizedQuery = query.trim();
  const isDebouncing = Boolean(normalizedQuery) && normalizedQuery !== debouncedQuery.trim();

  if (!normalizedQuery)
    return (
      <HeaderProductSearchEmptyFallback description="برای دیدن پیشنهادها، نام آیتم را وارد کنید." />
    );

  if (isDebouncing) {
    return (
      <div
        role="status"
        className="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:p-8 tw:text-muted-foreground"
      >
        <Spinner size="sm" />
        در حال جستجو…
      </div>
    );
  }

  return <HeaderProductSearchResultsStream query={debouncedQuery.trim()} />;
}
