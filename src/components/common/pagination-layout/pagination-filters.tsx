'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ListFilter } from 'lucide-react';
import { useRouter } from 'nextjs-toploader/app';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Field } from '@/components/ui/field/default';
import { FieldLabel } from '@/components/ui/field/label';
import { Checkbox } from '@/components/ui/fields/checkbox';
import { Input } from '@/components/ui/fields/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/fields/select';
import { Switch } from '@/components/ui/fields/switch';
import { Separator } from '@/components/ui/separator';
import { createPaginationHref } from '@/entities/pagination/pagination.helpers';
import type { FilterDTO, FilterOptionDTO } from '@/entities/pagination/pagination.types';

type PaginationFiltersProps = Readonly<{
  basePath: string;
  disabled?: boolean;
  filters: readonly FilterDTO[];
  idPrefix: string;
  label: string;
  query: Readonly<Record<string, string>>;
  variant?: 'filled' | 'outlined';
}>;

function selectedValues(value?: string) {
  return value?.split(',').filter(Boolean) ?? [];
}

function optionLabel(option: FilterOptionDTO) {
  return option.count === undefined ? option.label : `${option.label} (${option.count})`;
}

function createFilterValues(
  filters: readonly FilterDTO[],
  query: Readonly<Record<string, string>>,
) {
  return Object.fromEntries(
    filters.flatMap((filter) => (query[filter.key] ? [[filter.key, query[filter.key]]] : [])),
  );
}

export function PaginationFilters({
  basePath,
  disabled = false,
  filters,
  idPrefix,
  label,
  query,
  variant = 'outlined',
}: PaginationFiltersProps) {
  const router = useRouter();
  const orderedFilters = useMemo(
    () => [...filters].sort((left, right) => left.order - right.order),
    [filters],
  );
  const [values, setValues] = useState<Record<string, string>>(() =>
    createFilterValues(filters, query),
  );

  function setValue(key: string, value?: string) {
    setValues((current) => {
      const next = { ...current };
      if (value) next[key] = value;
      else delete next[key];
      return next;
    });
  }

  function applyFilters() {
    const changes: Record<string, string | null | number> = { page: 1 };
    for (const filter of filters) changes[filter.key] = values[filter.key] || null;
    router.push(createPaginationHref(basePath, query, changes), { scroll: false });
  }

  function clearFilters() {
    const changes: Record<string, null | number> = { page: 1 };
    for (const filter of filters) changes[filter.key] = null;
    setValues({});
    router.push(createPaginationHref(basePath, query, changes), { scroll: false });
  }

  return (
    <Card variant={variant} size="sm">
      <CardHeader>
        <CardTitle className="tw:flex tw:items-center tw:gap-2">
          <ListFilter aria-hidden="true" className="tw:text-primary" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="tw:flex tw:flex-col tw:gap-5">
        {orderedFilters.length === 0 ? (
          <p className="tw:text-body-s tw:text-muted-foreground">
            فیلتری برای این فهرست در دسترس نیست.
          </p>
        ) : (
          orderedFilters.map((filter, index) => (
            <Collapsible key={filter.key} defaultOpen className="tw:flex tw:flex-col tw:gap-3">
              {index > 0 ? <Separator /> : null}
              <CollapsibleTrigger
                disabled={disabled}
                render={
                  <Button block color="secondary" variant="flat" className="tw:justify-between" />
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
            disabled={disabled || filters.length === 0}
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
  value,
}: Readonly<{
  disabled: boolean;
  filter: FilterDTO;
  idPrefix: string;
  onChange: (value?: string) => void;
  value?: string;
}>) {
  if (filter.type === 'select') {
    return (
      <Select
        items={filter.options}
        value={value ?? null}
        onValueChange={(nextValue) => onChange(nextValue ?? undefined)}
        disabled={disabled}
      >
        <SelectTrigger aria-label={filter.label}>
          <SelectValue placeholder="انتخاب کنید" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {optionLabel(option)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }

  if (filter.type === 'multi-select') {
    const selected = new Set(selectedValues(value));
    return (
      <div className="tw:flex tw:flex-col tw:gap-3 tw:px-3">
        {filter.options.map((option, index) => {
          const id = `${idPrefix}-${filter.key}-${index}`;
          return (
            <Field key={option.value} className="tw:flex-row tw:items-center">
              <Checkbox
                id={id}
                size="sm"
                checked={selected.has(option.value)}
                disabled={disabled}
                onCheckedChange={(checked) => {
                  const next = new Set(selected);
                  if (checked) next.add(option.value);
                  else next.delete(option.value);
                  onChange([...next].join(','));
                }}
              />
              <FieldLabel htmlFor={id}>{optionLabel(option)}</FieldLabel>
            </Field>
          );
        })}
      </div>
    );
  }

  if (filter.type === 'range') {
    const [minimum = '', maximum = ''] = value?.split('-') ?? [];
    return (
      <div className="tw:grid tw:grid-cols-2 tw:gap-2 tw:px-3">
        <Field>
          <FieldLabel htmlFor={`${idPrefix}-${filter.key}-minimum`}>از {filter.unit}</FieldLabel>
          <Input
            id={`${idPrefix}-${filter.key}-minimum`}
            type="number"
            min={filter.min}
            max={filter.max}
            step={filter.step}
            value={minimum}
            disabled={disabled}
            onChange={(event) => onChange(`${event.target.value}-${maximum || filter.max}`)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={`${idPrefix}-${filter.key}-maximum`}>تا {filter.unit}</FieldLabel>
          <Input
            id={`${idPrefix}-${filter.key}-maximum`}
            type="number"
            min={filter.min}
            max={filter.max}
            step={filter.step}
            value={maximum}
            disabled={disabled}
            onChange={(event) => onChange(`${minimum || filter.min}-${event.target.value}`)}
          />
        </Field>
      </div>
    );
  }

  const id = `${idPrefix}-${filter.key}`;
  return (
    <Field className="tw:flex-row tw:items-center tw:justify-between tw:px-3">
      <FieldLabel htmlFor={id}>
        {filter.label}
        {filter.count === undefined ? null : ` (${filter.count})`}
      </FieldLabel>
      <Switch
        id={id}
        size="sm"
        checked={value === 'true'}
        disabled={disabled}
        onCheckedChange={(checked) => onChange(checked ? 'true' : undefined)}
      />
    </Field>
  );
}
