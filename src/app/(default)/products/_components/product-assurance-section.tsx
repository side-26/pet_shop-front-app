import { cacheLife } from 'next/cache';

import { MotionItem, MotionSection } from './product-landing-motion';
import { shoppingPromises } from './product-landing-data';

export async function ProductAssuranceSection() {
  'use cache';
  cacheLife('max');

  return <ProductAssuranceRenderer />;
}

export function ProductAssuranceRenderer() {
  return (
    <MotionSection
      labelledBy="shopping-promise-title"
      cacheSection="assurance"
      className="tw:px-4 tw:py-8 tw:sm:px-6 tw:md:px-8 tw:lg:py-10"
    >
      <h2 id="shopping-promise-title" className="tw:sr-only">
        قول خرید پرشین پت
      </h2>
      <div className="tw:mx-auto tw:grid tw:w-full tw:max-w-7xl tw:gap-3 tw:sm:grid-cols-3 tw:lg:gap-5">
        {shoppingPromises.map(({ title, description, icon: Icon }) => (
          <MotionItem key={title}>
            <div className="tw:flex tw:h-full tw:items-center tw:gap-4 tw:rounded-3xl tw:border tw:border-border/60 tw:bg-card/70 tw:p-4 tw:shadow-sm tw:supports-backdrop-filter:backdrop-blur-xl tw:sm:flex-col tw:sm:items-start tw:lg:flex-row tw:lg:items-center tw:lg:p-5">
              <span className="tw:flex tw:size-12 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-primary-muted tw:text-primary-muted-foreground">
                <Icon aria-hidden="true" className="tw:size-6" />
              </span>
              <span className="tw:flex tw:flex-col tw:gap-0.5">
                <strong className="tw:text-title-s">{title}</strong>
                <span className="tw:text-body-s tw:text-muted-foreground">{description}</span>
              </span>
            </div>
          </MotionItem>
        ))}
      </div>
    </MotionSection>
  );
}
