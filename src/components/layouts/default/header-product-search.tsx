'use client';

import { ArrowRight, Search, X } from 'lucide-react';
import { useRouter } from 'nextjs-toploader/app';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/fields/input-group';
import { Form } from '@/components/ui/form';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Spinner } from '@/components/ui/spinner';
import { routePaths } from '@/configs/route.path';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';

import { HeaderProductSearchEmptyFallback } from './header-product-search/header-product-search-empty-fallback';
import { HeaderProductSearchProvider } from './header-product-search/header-product-search-context';
import { HeaderProductSearchResultsStream } from './header-product-search/header-product-search-results-stream';

type HeaderProductSearchProps = Readonly<{
  className?: string;
}>;

export function HeaderProductSearch({ className }: HeaderProductSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const debouncedQuery = useDebounce(query);

  const closeSearch = () => {
    setDesktopOpen(false);
    setMobileOpen(false);
  };

  const handleSubmit = () => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) return;

    closeSearch();
    router.push(routePaths.productsSearch(normalizedQuery));
  };

  return (
    <HeaderProductSearchProvider onCloseHoverCard={closeSearch}>
      <div className={cn('tw:min-w-0 tw:w-full tw:lg:w-72', className)}>
        <div className="tw:hidden tw:lg:block">
          <HoverCard open={desktopOpen} onOpenChange={setDesktopOpen}>
            <HoverCardTrigger delay={0} closeDelay={180} render={<div className="tw:w-full" />}>
              <SearchForm
                query={query}
                onQueryChange={setQuery}
                onFocus={() => setDesktopOpen(true)}
                onClear={() => setQuery('')}
                onSubmit={handleSubmit}
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

        <div className="tw:lg:hidden">
          <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
            <InputGroup className="tw:h-11 tw:border-border/70 tw:bg-muted/75 tw:shadow-none">
              <InputGroupAddon>
                <Search aria-hidden="true" />
              </InputGroupAddon>
              <DialogTrigger
                nativeButton={false}
                render={
                  <InputGroupInput
                    type="search"
                    readOnly
                    aria-label="باز کردن جستجوی سریع"
                    placeholder="جستجو سریع..."
                    value={query}
                    className="tw:cursor-pointer tw:text-body-s"
                  />
                }
              />
            </InputGroup>

            <DialogContent
              size="xl"
              showCloseButton={false}
              className="tw:max-h-[calc(100svh-2rem)] tw:gap-0 tw:overflow-hidden tw:p-0"
            >
              <DialogTitle className="tw:sr-only">جستجو سریع</DialogTitle>
              <DialogDescription className="tw:sr-only">
                آیتم‌های مرتبط با عبارت واردشده را انتخاب کنید.
              </DialogDescription>

              <div className="tw:flex tw:items-center tw:gap-2 tw:border-b tw:border-border tw:p-4">
                <DialogClose
                  render={<Button iconOnly variant="flat" aria-label="بازگشت از جستجو" />}
                >
                  <ArrowRight aria-hidden="true" />
                </DialogClose>
                <SearchForm
                  query={query}
                  onQueryChange={setQuery}
                  onClear={() => setQuery('')}
                  onSubmit={handleSubmit}
                  autoFocus
                  className="tw:flex-1"
                />
              </div>

              <div className="tw:overflow-y-auto">
                <SearchPanelContent query={query} debouncedQuery={debouncedQuery} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </HeaderProductSearchProvider>
  );
}

type SearchFormProps = Readonly<{
  query: string;
  onQueryChange: (value: string) => void;
  onClear: () => void;
  onSubmit: () => void;
  onFocus?: () => void;
  autoFocus?: boolean;
  className?: string;
}>;

function SearchForm({
  query,
  onQueryChange,
  onClear,
  onSubmit,
  onFocus,
  autoFocus,
  className,
}: SearchFormProps) {
  return (
    <Form role="search" className={className} handleSubmit={onSubmit}>
      <InputGroup className="tw:h-11 tw:border-border/70 tw:bg-muted/75 tw:shadow-none">
        <InputGroupAddon>
          <Search aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          name="q"
          value={query}
          aria-label="جستجو سریع"
          placeholder="جستجو سریع..."
          autoComplete="off"
          autoFocus={autoFocus}
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
    </Form>
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
