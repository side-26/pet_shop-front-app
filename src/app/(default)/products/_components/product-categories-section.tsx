import { ArrowLeft } from 'lucide-react';
import { cacheLife } from 'next/cache';
import Image from 'next/image';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { MotionItem, MotionSection } from './product-landing-motion';
import { productCategories } from './product-landing-data';

export async function ProductCategoriesSection() {
  'use cache';
  cacheLife('max');

  return <ProductCategoriesRenderer />;
}

export function ProductCategoriesRenderer() {
  return (
    <MotionSection
      id="pet-categories"
      labelledBy="pet-categories-title"
      cacheSection="categories"
      className="tw:bg-surface tw:px-4 tw:py-16 tw:sm:px-6 tw:md:px-8 tw:lg:py-24"
    >
      <div className="tw:mx-auto tw:flex tw:w-full tw:max-w-7xl tw:flex-col tw:gap-8">
        <MotionItem className="tw:flex tw:flex-col tw:gap-2 tw:sm:flex-row tw:sm:items-end tw:sm:justify-between">
          <div className="tw:flex tw:flex-col tw:gap-2">
            <span className="tw:text-label-m tw:font-bold tw:text-primary">
              خرید بر اساس همراه شما
            </span>
            <h2 id="pet-categories-title" className="tw:text-heading-2 tw:lg:text-heading-1">
              از دنیای او شروع کن
            </h2>
          </div>
          <p className="tw:max-w-lg tw:text-body-m tw:text-muted-foreground">
            دسته‌بندی‌ها طوری چیده شده‌اند که بدون جست‌وجوی طولانی، به انتخاب‌های مناسب هر پت برسید.
          </p>
        </MotionItem>

        <div className="tw:grid tw:grid-cols-2 tw:gap-3 tw:md:grid-cols-4 tw:lg:gap-5">
          {productCategories.map(({ title, description, image, imageAlt, icon: Icon, tone }) => (
            <MotionItem key={title}>
              <Card
                size="xs"
                className="tw:group tw:h-full tw:transition-[transform,box-shadow] tw:duration-300 tw:hover:-translate-y-1.5 tw:hover:shadow-xl tw:motion-reduce:transition-none tw:motion-reduce:hover:transform-none"
              >
                <div className="tw:relative tw:mx-3 tw:mt-3 tw:aspect-[4/3] tw:overflow-hidden tw:rounded-2xl">
                  <Image
                    src={image}
                    alt={imageAlt}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="tw:object-cover tw:transition-transform tw:duration-500 tw:group-hover:scale-105 tw:motion-reduce:transition-none tw:motion-reduce:group-hover:transform-none"
                  />
                  <span className="tw:absolute tw:start-2 tw:top-2 tw:flex tw:size-9 tw:items-center tw:justify-center tw:rounded-xl tw:bg-card/85 tw:text-primary tw:shadow-sm tw:supports-backdrop-filter:backdrop-blur-lg">
                    <Icon aria-hidden="true" className="tw:size-5" />
                  </span>
                </div>
                <CardHeader className="tw:pb-0">
                  <CardTitle className="tw:flex tw:items-center tw:justify-between tw:gap-2">
                    {title}
                    <ArrowLeft
                      aria-hidden="true"
                      className="tw:size-4 tw:text-primary tw:transition-transform tw:duration-200 tw:group-hover:-translate-x-1 tw:motion-reduce:transition-none tw:motion-reduce:group-hover:transform-none"
                    />
                  </CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className="tw:mt-auto tw:pt-2">
                  <span
                    className={`tw:inline-flex tw:rounded-full tw:px-2.5 tw:py-1 tw:text-caption ${tone}`}
                  >
                    انتخاب‌های پیشنهادی
                  </span>
                </CardContent>
              </Card>
            </MotionItem>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
