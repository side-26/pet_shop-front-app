'use client';

import { lazy } from 'react';

import { FadeIn } from '@/components/common/animation/fade-in';

const CategoriesSectionClient = lazy(async () => {
  const categories = await import('./categories-section-client');
  return { default: categories.CategoriesSectionClient };
});

/** Loads the category section only shortly before it enters the viewport. */
export function LazyCategoriesSection() {
  return <FadeIn loading="lazy" dynamicPromiseComponent={CategoriesSectionClient} />;
}
