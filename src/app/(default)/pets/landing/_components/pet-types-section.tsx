import Link from 'next/link';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { routePaths } from '@/configs/route.path';
import { cn } from '@/lib/utils';

import { petTypeIconStyles, petTypes } from './pet-landing-data';

export function PetTypesSection() {
  return (
    <section
      id="pet-types"
      aria-labelledby="pet-types-title"
      className="tw:mx-auto tw:w-full tw:max-w-7xl tw:px-4 tw:py-8 tw:sm:px-6 tw:md:px-8 tw:md:py-12"
    >
      <div className="tw:mb-6 tw:flex tw:flex-col tw:gap-2 tw:md:mb-8">
        <h2 id="pet-types-title" className="tw:text-title-l tw:md:text-heading-1">
          دسته‌بندی حیوانات
        </h2>
        <p className="tw:text-body-m tw:text-muted-foreground">
          حیوان خانگی مورد علاقه خود را بر اساس دسته‌بندی جستجو کنید
        </p>
      </div>

      <div className="tw:grid tw:grid-cols-2 tw:gap-4 tw:sm:grid-cols-3 tw:lg:grid-cols-6">
        {petTypes.map(({ name, icon: Icon, color }) => (
          <Link
            key={name}
            href={routePaths.petsList}
            aria-label={`مشاهده ${name}`}
            className="tw:rounded-3xl tw:outline-none tw:focus-visible:ring-3 tw:focus-visible:ring-primary/25"
          >
            <Card variant="outlined" size="sm" className="tw:h-full tw:min-h-36 tw:justify-center">
              <CardHeader className="tw:items-center tw:text-center">
                <span
                  className={cn(
                    'tw:flex tw:size-16 tw:items-center tw:justify-center tw:rounded-full tw:md:size-20',
                    petTypeIconStyles[color],
                  )}
                >
                  <Icon aria-hidden="true" className="tw:size-8 tw:md:size-10" />
                </span>
                <CardTitle className="tw:mt-2 tw:text-label-m tw:md:text-title-l">{name}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
