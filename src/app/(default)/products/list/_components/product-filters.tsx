import { PawPrint } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field/default';
import { FieldLabel } from '@/components/ui/field/label';
import { Checkbox } from '@/components/ui/fields/checkbox';
import { Separator } from '@/components/ui/separator';

const filterGroups = [
  { title: 'نوع حیوان', options: ['سگ بالغ', 'توله سگ', 'گربه'] },
  { title: 'دسته‌بندی', options: ['غذای خشک', 'تشویقی', 'اسباب‌بازی', 'لوازم بهداشتی'] },
] as const;

type ProductFiltersProps = Readonly<{ compact?: boolean }>;

export function ProductFilters({ compact = false }: ProductFiltersProps) {
  return (
    <Card variant={compact ? 'filled' : 'outlined'} size="sm">
      <CardHeader>
        <CardTitle className="tw:flex tw:items-center tw:gap-2">
          <PawPrint aria-hidden="true" className="tw:text-primary" />
          فیلتر محصولات
        </CardTitle>
        <CardDescription>
          انتخاب‌ها را برای رسیدن سریع‌تر به محصول مناسب محدود کنید.
        </CardDescription>
      </CardHeader>
      <CardContent className="tw:flex tw:flex-col tw:gap-5">
        {filterGroups.map((group, groupIndex) => (
          <div key={group.title} className="tw:flex tw:flex-col tw:gap-3">
            {groupIndex > 0 ? <Separator /> : null}
            <h3 className="tw:text-title-s">{group.title}</h3>
            <div className="tw:flex tw:flex-col tw:gap-3">
              {group.options.map((option, optionIndex) => {
                const id = `${compact ? 'mobile' : 'desktop'}-${groupIndex}-${optionIndex}`;
                return (
                  <Field key={option} className="tw:flex-row tw:items-center">
                    <Checkbox id={id} defaultChecked={optionIndex === 0} size="sm" />
                    <FieldLabel htmlFor={id}>{option}</FieldLabel>
                  </Field>
                );
              })}
            </div>
          </div>
        ))}
        <Button block>اعمال فیلترها</Button>
      </CardContent>
    </Card>
  );
}
