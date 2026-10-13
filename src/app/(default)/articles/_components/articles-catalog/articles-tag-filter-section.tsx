'use client';

import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { ArticleTagResponse } from '@/entities/articles/articles.dto';

type ArticlesTagFilterSectionProps = Readonly<{
  disabled?: boolean;
  selectedTags: ReadonlySet<string>;
  tags: readonly ArticleTagResponse[];
  onToggle: (tag: string) => void;
}>;

export function ArticlesTagFilterSection({
  disabled = false,
  selectedTags,
  tags,
  onToggle,
}: ArticlesTagFilterSectionProps) {
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
                  onClick={() => onToggle(tag.title)}
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
