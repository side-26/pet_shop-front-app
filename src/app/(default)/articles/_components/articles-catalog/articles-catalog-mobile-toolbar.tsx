'use client';

import { ArrowDownUpIcon, SlidersHorizontalIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/fields/select';
import type {
  ArticleCatalogPetTypeDTO,
  ArticleListSortOptionDTO,
  ArticleTagResponse,
} from '@/entities/articles/articles.dto';
import { useArticleCatalogControls } from '../../_hooks/use-article-catalog-controls';

import { ArticlesCatalogFilterControls } from './articles-catalog-filter-controls';

type ArticlesCatalogMobileToolbarProps = Readonly<{
  currentSort: string;
  disabled?: boolean;
  options: readonly ArticleListSortOptionDTO[];
  petTypes: readonly ArticleCatalogPetTypeDTO[];
  petType?: string;
  query: Readonly<Record<string, string>>;
  selectedTags: ReadonlySet<string>;
  tags: readonly ArticleTagResponse[];
  totalItems: number;
}>;

export function ArticlesCatalogMobileToolbar({
  currentSort,
  disabled = false,
  options,
  petTypes,
  petType,
  query,
  selectedTags,
  tags,
  totalItems,
}: ArticlesCatalogMobileToolbarProps) {
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const { changeSort } = useArticleCatalogControls(query);
  const selectedSortLabel = options.find((option) => option.value === currentSort)?.label;

  return (
    <div className="tw:sticky tw:top-20 tw:z-20 tw:flex tw:items-center tw:gap-2 tw:rounded-2xl tw:border tw:border-border/60 tw:bg-background/90 tw:p-3 tw:shadow-lg tw:shadow-foreground/5 tw:supports-backdrop-filter:backdrop-blur-xl tw:lg:hidden">
      <div className="tw:flex-auto tw:w-10 tw:grid tw:grid-cols-2 tw:items-center tw:gap-2">
        <div>
          <Select
            disabled={disabled}
            value={currentSort}
            onValueChange={(sort) => sort && changeSort(sort)}
          >
            <SelectTrigger aria-label="مرتب‌سازی مقاله‌ها" prefixIcon={<ArrowDownUpIcon />}>
              <SelectValue>{selectedSortLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
          <DialogTrigger
            disabled={disabled}
            render={<Button iconOnly aria-label="فیلتر مقاله‌ها" variant="outlined" />}
          >
            <SlidersHorizontalIcon aria-hidden="true" />
          </DialogTrigger>
          <DialogContent size="md" className="tw:max-h-[calc(100dvh-2rem)] tw:overflow-y-auto">
            <DialogHeader className="tw:pe-10">
              <DialogTitle>فیلتر مقاله‌ها</DialogTitle>
              <DialogDescription>موضوع یا نوع حیوان موردنظر را انتخاب کنید.</DialogDescription>
            </DialogHeader>
            <ArticlesCatalogFilterControls
              disabled={disabled}
              petTypes={petTypes}
              query={query}
              selectedTags={selectedTags}
              tags={tags}
              value={petType}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="tw:text-body-s tw:flex-none tw:text-muted-foreground">
        {totalItems.toLocaleString()} مقاله
      </div>
    </div>
  );
}
