import { ChevronDown, PawPrint } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Field } from '@/components/ui/field/default';
import { FieldLabel } from '@/components/ui/field/label';
import { Checkbox } from '@/components/ui/fields/checkbox';
import { Separator } from '@/components/ui/separator';

const filterGroups = [
  { title: 'نوع حیوان', options: ['سگ', 'گربه', 'پرنده'] },
  { title: 'سن', options: ['کمتر از ۶ ماه', '۶ تا ۱۲ ماه', 'بیشتر از ۱ سال'] },
  { title: 'جنسیت', options: ['نر', 'ماده'] },
] as const;

type PetFiltersProps = Readonly<{ compact?: boolean; showAction?: boolean }>;

export function PetFilters({ compact = false, showAction = true }: PetFiltersProps) {
  return (
    <Card variant={compact ? 'filled' : 'outlined'} size="sm">
      <CardHeader>
        <CardTitle className="tw:flex tw:items-center tw:gap-2">
          <PawPrint aria-hidden="true" className="tw:text-primary" />
          فیلتر حیوانات
        </CardTitle>
      </CardHeader>
      <CardContent className="tw:flex tw:flex-col tw:gap-5">
        {filterGroups.map((group, groupIndex) => (
          <Collapsible key={group.title} defaultOpen className="tw:flex tw:flex-col tw:gap-3">
            {groupIndex > 0 ? <Separator /> : null}
            <CollapsibleTrigger
              render={
                <Button block color="secondary" variant="flat" className="tw:justify-between" />
              }
            >
              <span>{group.title}</span>
              <ChevronDown
                aria-hidden="true"
                className="tw:transition-transform tw:group-aria-expanded/button:rotate-180 tw:motion-reduce:transition-none"
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="tw:flex tw:flex-col tw:gap-3 tw:px-3">
                {group.options.map((option, optionIndex) => {
                  const id = `${compact ? 'mobile' : 'desktop'}-pet-${groupIndex}-${optionIndex}`;
                  return (
                    <Field key={option} className="tw:flex-row tw:items-center">
                      <Checkbox
                        id={id}
                        defaultChecked={groupIndex === 0 && optionIndex === 0}
                        size="sm"
                      />
                      <FieldLabel htmlFor={id}>{option}</FieldLabel>
                    </Field>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
        {showAction ? <Button block>نمایش نتایج</Button> : null}
      </CardContent>
    </Card>
  );
}
