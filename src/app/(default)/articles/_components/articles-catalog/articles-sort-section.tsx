'use client';

import { ArrowDownUpIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { ArticleListSortOptionDTO } from '@/entities/articles/articles.dto';
import { useArticleCatalogControls } from '../../_hooks/use-article-catalog-controls';

type ArticlesSortSectionProps = Readonly<{
  current: string;
  disabled?: boolean;
  options: readonly ArticleListSortOptionDTO[];
  query: Readonly<Record<string, string>>;
  totalItems: number;
}>;

export function ArticlesSortSection({
  current,
  disabled = false,
  options,
  query,
  totalItems,
}: ArticlesSortSectionProps) {
  const { changeSort } = useArticleCatalogControls(query);

  return (
    <div className="tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-3 tw:rounded-2xl tw:border tw:border-border/70 tw:bg-card tw:p-3">
      <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
        <div className="tw:flex tw:items-center tw:gap-2 tw:text-label-m tw:text-muted-foreground">
          <ArrowDownUpIcon aria-hidden="true" className="tw:size-4" />
          <span>مرتب‌سازی:</span>
        </div>
        <div className="tw:flex tw:flex-wrap tw:gap-1" role="group" aria-label="مرتب‌سازی مقاله‌ها">
          {options.map((option) => {
            const isSelected = current === option.value;

            return (
              <Button
                key={option.value}
                aria-pressed={isSelected}
                color="primary"
                disabled={disabled || isSelected}
                size="xs"
                variant={isSelected ? 'tonal' : 'flat'}
                onClick={() => changeSort(option.value)}
              >
                {option.label}
              </Button>
            );
          })}
        </div>
      </div>
      <span className="tw:text-body-s tw:text-muted-foreground">
        {totalItems.toLocaleString('fa-IR')} مقاله
      </span>
    </div>
  );
}
