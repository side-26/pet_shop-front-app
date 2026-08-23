'use client';

import { ArrowRight, Search, TrendingUp, X } from 'lucide-react';
import Link from 'next/link';
import { type FormEvent, useMemo, useState } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/fields/input-group';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Spinner } from '@/components/ui/spinner';
import { routePaths } from '@/configs/route.path';
import { useSetDefaultValue } from '@/hooks/use-set-default-value';
import { cn } from '@/lib/utils';

type HeaderProductSearchProps = Readonly<{
  className?: string;
}>;

type SearchSuggestion = Readonly<{
  title: string;
  category: string;
}>;

const popularSearches = [
  'غذای خشک سگ',
  'غذای گربه',
  'خاک گربه',
  'اسباب‌بازی سگ',
  'قلاده',
  'غذای پرنده',
] as const;

const searchSuggestions: readonly SearchSuggestion[] = [
  { title: 'غذای خشک سگ بالغ', category: 'غذای سگ' },
  { title: 'غذای خشک گربه بالغ', category: 'غذای گربه' },
  { title: 'خاک گربه کربن‌دار', category: 'بهداشت گربه' },
  { title: 'اسباب‌بازی دندانی سگ', category: 'اسباب‌بازی حیوانات' },
  { title: 'قلاده کتفی سگ', category: 'لوازم گردش' },
  { title: 'غذای عروس هلندی', category: 'غذای پرندگان' },
  { title: 'شامپو سگ و گربه', category: 'بهداشت حیوانات' },
];

export function HeaderProductSearch({ className }: HeaderProductSearchProps) {
  const [query, setQuery] = useState('');
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const debouncedQuery = useSetDefaultValue(query);
  const suggestions = useMemo(() => findSuggestions(debouncedQuery), [debouncedQuery]);

  const closeSearch = () => {
    setDesktopOpen(false);
    setMobileOpen(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!query.trim()) event.preventDefault();
  };

  return (
    <div className={cn('tw:w-[min(42vw,11rem)] tw:sm:w-64 tw:lg:w-72', className)}>
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
            <SearchPanelContent
              query={query}
              debouncedQuery={debouncedQuery}
              suggestions={suggestions}
              onNavigate={closeSearch}
            />
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
                  aria-label="باز کردن جستجوی محصولات"
                  placeholder="جستجو در محصولات..."
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
            <DialogTitle className="tw:sr-only">جستجو در محصولات</DialogTitle>
            <DialogDescription className="tw:sr-only">
              جستجوهای پرطرفدار یا پیشنهادهای مرتبط با عبارت واردشده را انتخاب کنید.
            </DialogDescription>

            <div className="tw:flex tw:items-center tw:gap-2 tw:border-b tw:border-border tw:p-4">
              <DialogClose render={<Button iconOnly variant="flat" aria-label="بازگشت از جستجو" />}>
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
              <SearchPanelContent
                query={query}
                debouncedQuery={debouncedQuery}
                suggestions={suggestions}
                onNavigate={closeSearch}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

type SearchFormProps = Readonly<{
  query: string;
  onQueryChange: (value: string) => void;
  onClear: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
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
    <form
      role="search"
      action={routePaths.products}
      method="get"
      className={className}
      onSubmit={onSubmit}
    >
      <InputGroup className="tw:h-11 tw:border-border/70 tw:bg-muted/75 tw:shadow-none">
        <InputGroupAddon>
          <Search aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          name="q"
          value={query}
          aria-label="جستجو در محصولات"
          placeholder="جستجو در محصولات..."
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
    </form>
  );
}

type SearchPanelContentProps = Readonly<{
  query: string;
  debouncedQuery: string;
  suggestions: readonly SearchSuggestion[];
  onNavigate: () => void;
}>;

function SearchPanelContent({
  query,
  debouncedQuery,
  suggestions,
  onNavigate,
}: SearchPanelContentProps) {
  const normalizedQuery = query.trim();
  const isDebouncing = Boolean(normalizedQuery) && normalizedQuery !== debouncedQuery.trim();

  if (!normalizedQuery) {
    return (
      <section
        aria-labelledby="popular-searches-heading"
        className="tw:flex tw:flex-col tw:gap-4 tw:p-5"
      >
        <div className="tw:flex tw:items-center tw:gap-2">
          <TrendingUp className="tw:size-5 tw:text-primary" aria-hidden="true" />
          <h2 id="popular-searches-heading" className="tw:text-title-s">
            جستجوهای پرطرفدار
          </h2>
        </div>
        <div className="tw:flex tw:flex-wrap tw:gap-2">
          {popularSearches.map((item) => (
            <Link
              key={item}
              href={routePaths.productsSearch(item)}
              onClick={onNavigate}
              className={buttonVariants({ variant: 'tonal', color: 'secondary', size: 'sm' })}
            >
              <TrendingUp data-icon="inline-start" aria-hidden="true" />
              {item}
            </Link>
          ))}
        </div>
      </section>
    );
  }

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

  return (
    <section
      aria-labelledby="search-suggestions-heading"
      className="tw:flex tw:flex-col tw:gap-2 tw:p-3"
    >
      <h2
        id="search-suggestions-heading"
        className="tw:px-2 tw:py-1 tw:text-label-m tw:text-muted-foreground"
      >
        پیشنهادهای جستجو
      </h2>
      {suggestions.length > 0 ? (
        <ul className="tw:flex tw:flex-col">
          {suggestions.map((suggestion) => (
            <li key={suggestion.title}>
              <Link
                href={routePaths.productsSearch(suggestion.title)}
                onClick={onNavigate}
                className="tw:flex tw:min-h-12 tw:items-center tw:gap-3 tw:rounded-xl tw:px-3 tw:py-2 tw:transition-colors tw:hover:bg-muted tw:focus-visible:outline-none tw:focus-visible:ring-3 tw:focus-visible:ring-primary/20"
              >
                <Search
                  className="tw:size-4 tw:shrink-0 tw:text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="tw:flex tw:min-w-0 tw:flex-1 tw:flex-col tw:gap-0.5">
                  <span className="tw:text-body-m">{suggestion.title}</span>
                  <span className="tw:text-label-s tw:text-muted-foreground">
                    در {suggestion.category}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="tw:flex tw:flex-col tw:items-center tw:gap-3 tw:px-4 tw:py-7 tw:text-center">
          <p className="tw:text-body-m tw:text-muted-foreground">
            پیشنهادی برای «{debouncedQuery}» پیدا نشد.
          </p>
          <Link
            href={routePaths.productsSearch(debouncedQuery)}
            onClick={onNavigate}
            className={buttonVariants({ variant: 'outlined', size: 'sm' })}
          >
            جستجوی همین عبارت
          </Link>
        </div>
      )}
    </section>
  );
}

function findSuggestions(query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase('fa');
  if (!normalizedQuery) return [];

  return searchSuggestions
    .filter((suggestion) =>
      `${suggestion.title} ${suggestion.category}`
        .toLocaleLowerCase('fa')
        .includes(normalizedQuery),
    )
    .slice(0, 6);
}
