'use client';

import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Field } from '@/components/ui/field/default';
import { FieldLabel } from '@/components/ui/field/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/fields/radio-group';
import type { ArticleCatalogPetTypeDTO } from '@/entities/articles/articles.dto';
import { useArticleCatalogControls } from '../../_hooks/use-article-catalog-controls';

type ArticlesPetTypeFilterSectionProps = Readonly<{
  disabled?: boolean;
  petTypes: readonly ArticleCatalogPetTypeDTO[];
  query: Readonly<Record<string, string>>;
  value?: string;
}>;

export function ArticlesPetTypeFilterSection({
  disabled = false,
  petTypes,
  query,
  value,
}: ArticlesPetTypeFilterSectionProps) {
  const { changePetType } = useArticleCatalogControls(query);

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
        <span>نوع حیوان</span>
        <ChevronDownIcon
          aria-hidden="true"
          className="tw:transition-transform tw:group-aria-expanded/button:rotate-180 tw:motion-reduce:transition-none"
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <RadioGroup
          aria-label="فیلتر نوع حیوان"
          disabled={disabled}
          value={value ?? 'all'}
          onValueChange={(nextValue) => changePetType(nextValue === 'all' ? undefined : nextValue)}
        >
          <Field className="tw:flex-row tw:items-center">
            <RadioGroupItem id="article-pet-type-all" size="sm" value="all" />
            <FieldLabel htmlFor="article-pet-type-all">همه نوع‌ها</FieldLabel>
          </Field>
          {petTypes.map((petType) => {
            const inputId = `article-pet-type-${petType._id}`;

            return (
              <Field key={petType._id} className="tw:flex-row tw:items-center">
                <RadioGroupItem id={inputId} size="sm" value={petType._id} />
                <FieldLabel htmlFor={inputId}>{petType.title}</FieldLabel>
              </Field>
            );
          })}
        </RadioGroup>
      </CollapsibleContent>
    </Collapsible>
  );
}
