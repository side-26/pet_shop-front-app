'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ListFilter } from 'lucide-react';
import { useRouter } from 'nextjs-toploader/app';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { createPaginationHref } from '@/entities/pagination/pagination.helpers';
import type { FilterDTO } from '@/entities/pagination/pagination.types';
import { cn } from '@/lib/utils';

import { BooleanPaginationFilter } from './boolean';
import { MultiSelectPaginationFilter } from './multi-select';
import { RangePaginationFilter } from './range';
import { SelectPaginationFilter } from './select';

export type RangeQueryKeys = Readonly<{ min: string; max: string }>;

type PaginationFiltersProps = Readonly<{
  basePath: string;
  disabled?: boolean;
  filters: readonly FilterDTO[];
  idPrefix: string;
  label: string;
  query: Readonly<Record<string, string>>;
  rangeQueryKeys?: Readonly<Record<string, RangeQueryKeys>>;
  resetPageOnChange?: boolean;
  scrollable?: boolean;
  variant?: 'filled' | 'outlined';
}>;

function createFilterValues(
  filters: readonly FilterDTO[],
  query: Readonly<Record<string, string>>,
  rangeQueryKeys: Readonly<Record<string, RangeQueryKeys>>,
) {
  return Object.fromEntries(
    filters.flatMap((filter) => {
      const keys = filter.type === 'range' ? rangeQueryKeys[filter.key] : undefined;
      if (keys) {
        const minimum = query[keys.min];
        const maximum = query[keys.max];
        return minimum || maximum ? [[filter.key, `${minimum ?? ''}-${maximum ?? ''}`]] : [];
      }
      return query[filter.key] ? [[filter.key, query[filter.key]]] : [];
    }),
  );
}

export function PaginationFilters({
  basePath,
  disabled = false,
  filters,
  idPrefix,
  label,
  query,
  rangeQueryKeys = {},
  resetPageOnChange = true,
  scrollable = false,
  variant = 'outlined',
}: PaginationFiltersProps) {
  const router = useRouter();
  const orderedFilters = useMemo(
    () => [...filters].sort((left, right) => left.order - right.order),
    [filters],
  );
  const [values, setValues] = useState<Record<string, string>>(() =>
    createFilterValues(filters, query, rangeQueryKeys),
  );
  const hasActiveFilters = Object.values(values).some(Boolean);

  function setValue(key: string, value?: string) {
    setValues((current) => {
      const next = { ...current };
      if (value) next[key] = value;
      else delete next[key];
      return next;
    });
  }

  function applyFilters() {
    const changes: Record<string, string | null | number> = resetPageOnChange ? { page: 1 } : {};
    for (const filter of filters) {
      const keys = filter.type === 'range' ? rangeQueryKeys[filter.key] : undefined;
      if (keys) {
        const [minimum, maximum] = values[filter.key]?.split('-') ?? [];
        changes[filter.key] = null;
        changes[keys.min] = minimum || null;
        changes[keys.max] = maximum || null;
      } else {
        changes[filter.key] = values[filter.key] || null;
      }
    }
    router.push(createPaginationHref(basePath, query, changes), { scroll: false });
  }

  function clearFilters() {
    const changes: Record<string, null | number> = resetPageOnChange ? { page: 1 } : {};
    for (const filter of filters) {
      const keys = filter.type === 'range' ? rangeQueryKeys[filter.key] : undefined;
      changes[filter.key] = null;
      if (keys) {
        changes[keys.min] = null;
        changes[keys.max] = null;
      }
    }
    setValues({});
    router.push(createPaginationHref(basePath, query, changes), { scroll: false });
  }

  function deleteFilter(filter: FilterDTO) {
    const changes: Record<string, null | number> = resetPageOnChange ? { page: 1 } : {};
    const keys = filter.type === 'range' ? rangeQueryKeys[filter.key] : undefined;

    changes[filter.key] = null;
    if (keys) {
      changes[keys.min] = null;
      changes[keys.max] = null;
    }

    setValue(filter.key);
    router.push(createPaginationHref(basePath, query, changes), { scroll: false });
  }

  return (
    <Card
      data-scrollable={scrollable || undefined}
      variant={variant}
      size="sm"
      className={cn(
        scrollable &&
          'tw:h-fit tw:min-h-0 tw:max-h-[calc(100dvh-var(--pagination-sidebar-offset))]',
      )}
    >
      <CardHeader>
        <CardTitle className="tw:flex tw:items-center tw:gap-2">
          <ListFilter aria-hidden="true" className="tw:text-primary" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent
        className={cn(
          'tw:flex tw:flex-col tw:gap-5',
          scrollable && 'tw:min-h-0 tw:flex-1 tw:overflow-y-auto tw:overscroll-contain',
        )}
      >
        {orderedFilters.length === 0 ? (
          <p className="tw:text-body-s tw:text-muted-foreground">
            فیلتری برای این فهرست در دسترس نیست.
          </p>
        ) : (
          orderedFilters.map((filter, index) => (
            <Collapsible key={filter.key} className="tw:flex tw:flex-col tw:gap-3">
              {index > 0 ? <Separator /> : null}
              <CollapsibleTrigger
                disabled={disabled}
                render={
                  <Button
                    block
                    color="secondary"
                    variant="flat"
                    className="tw:justify-between tw:text-foreground"
                  />
                }
              >
                <span>{filter.label}</span>
                <ChevronDown
                  aria-hidden="true"
                  className="tw:transition-transform tw:group-aria-expanded/button:rotate-180 tw:motion-reduce:transition-none"
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <FilterControl
                  disabled={disabled}
                  filter={filter}
                  idPrefix={idPrefix}
                  onChange={(value) => setValue(filter.key, value)}
                  onDelete={() => deleteFilter(filter)}
                  value={values[filter.key]}
                />
              </CollapsibleContent>
            </Collapsible>
          ))
        )}
        <div className="tw:grid tw:grid-cols-2 tw:gap-2">
          <Button
            block
            size="sm"
            disabled={disabled || filters.length === 0}
            onClick={applyFilters}
          >
            اعمال فیلترها
          </Button>
          <Button
            block
            size="sm"
            color="secondary"
            variant="outlined"
            disabled={disabled || !hasActiveFilters}
            onClick={clearFilters}
          >
            پاک کردن
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function FilterControl({
  disabled,
  filter,
  idPrefix,
  onChange,
  onDelete,
  value,
}: Readonly<{
  disabled: boolean;
  filter: FilterDTO;
  idPrefix: string;
  onChange: (value?: string) => void;
  onDelete: () => void;
  value?: string;
}>) {
  if (filter.type === 'select') {
    return (
      <SelectPaginationFilter
        disabled={disabled}
        filter={filter}
        idPrefix={idPrefix}
        onChange={onChange}
        onDelete={onDelete}
        value={value}
      />
    );
  }

  if (filter.type === 'multi-select') {
    return (
      <MultiSelectPaginationFilter
        disabled={disabled}
        filter={filter}
        idPrefix={idPrefix}
        onChange={onChange}
        onDelete={onDelete}
        value={value}
      />
    );
  }

  if (filter.type === 'boolean') {
    return (
      <BooleanPaginationFilter
        disabled={disabled}
        filter={filter}
        idPrefix={idPrefix}
        onChange={onChange}
        onDelete={onDelete}
        value={value}
      />
    );
  }

  return (
    <RangePaginationFilter
      disabled={disabled}
      filter={filter}
      idPrefix={idPrefix}
      onChange={onChange}
      onDelete={onDelete}
      value={value}
    />
  );
}
