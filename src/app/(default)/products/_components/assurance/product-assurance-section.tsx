import { cacheLife } from 'next/cache';

import { FadeIn } from '@/components/common/animation/fade-in';
import {
  AnimatedStaggeredList,
  animatedStaggeredListItemClassName,
} from '@/components/common/staggered-list';

import { shoppingPromises } from '../shared/product-landing-data';

export async function ProductAssuranceSection() {
  'use cache';
  cacheLife('max');

  return <ProductAssuranceRenderer />;
}

export function ProductAssuranceRenderer() {
  return (
    <FadeIn
      loading="eager"
      aria-labelledby="shopping-promise-title"
      data-cache-section="assurance"
      className="tw:py-8 tw:lg:py-10"
    >
      <h2 id="shopping-promise-title" className="tw:sr-only">
        قول خرید پرشین پت
      </h2>
      <AnimatedStaggeredList className="tw:default-layout-container tw:grid tw:gap-3 tw:sm:grid-cols-3 tw:lg:gap-5">
        {shoppingPromises.map(({ title, description, icon: Icon }) => (
          <div key={title} className={animatedStaggeredListItemClassName}>
            <div className="tw:flex tw:h-full tw:items-center tw:gap-4 tw:rounded-3xl tw:border tw:border-border/60 tw:bg-card/70 tw:p-4 tw:shadow-sm tw:supports-backdrop-filter:backdrop-blur-xl tw:sm:flex-col tw:sm:items-start tw:lg:flex-row tw:lg:items-center tw:lg:p-5">
              <span className="tw:flex tw:size-12 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-primary-muted tw:text-primary-muted-foreground">
                <Icon aria-hidden="true" className="tw:size-6" />
              </span>
              <span className="tw:flex tw:flex-col tw:gap-0.5">
                <strong className="tw:text-title-s">{title}</strong>
                <span className="tw:text-body-s tw:text-muted-foreground">{description}</span>
              </span>
            </div>
          </div>
        ))}
      </AnimatedStaggeredList>
    </FadeIn>
  );
}
