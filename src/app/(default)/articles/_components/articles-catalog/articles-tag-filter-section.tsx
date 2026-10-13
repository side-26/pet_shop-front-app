'use client';

import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { ArticleTagResponse } from '@/entities/articles/articles.dto';
import { useArticleCatalogControls } from '../../_hooks/use-article-catalog-controls';

type ArticlesTagFilterSectionProps = Readonly<{
  disabled?: boolean;
  query: Readonly<Record<string, string>>;
  selectedTags: ReadonlySet<string>;
  tags: readonly ArticleTagResponse[];
}>;

export function ArticlesTagFilterSection({
  disabled = false,
  query,
  selectedTags,
  tags,
}: ArticlesTagFilterSectionProps) {
  const { toggleTag } = useArticleCatalogControls(query);

  return (
    <Collapsible defaultOpen className="tw:flex tw:flex-col tw:gap-3">
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
        <span>برچسب‌ها</span>
        <ChevronDownIcon
          aria-hidden="true"
          className="tw:transition-transform tw:group-aria-expanded/button:rotate-180 tw:motion-reduce:transition-none"
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="tw:flex tw:flex-wrap tw:gap-2" role="group" aria-label="فیلتر موضوعی">
          {tags.length ? (
            tags.map((tag) => {
              const isSelected = selectedTags.has(tag.title);

              return (
                <Button
                  key={tag.title}
                  aria-pressed={isSelected}
                  color="primary"
                  disabled={disabled}
                  size="xs"
                  variant={isSelected ? 'tonal' : 'flat'}
                  onClick={() => toggleTag(tag.title)}
                >
                  {tag.title}
                </Button>
              );
            })
          ) : (
            <span className="tw:text-body-s tw:text-muted-foreground">
              موضوع‌ها در حال بارگذاری هستند.
            </span>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
