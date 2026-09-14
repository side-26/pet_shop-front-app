import { cn } from '@/lib/utils';

import { ProductCard } from './product-card';
import { productGridClassName, productGridSkeletonData } from './product-grid';

const twoRowVisibility = [
  '',
  '',
  'tw:hidden tw:min-[360px]:block',
  'tw:hidden tw:min-[360px]:block',
  'tw:hidden tw:md:block',
  'tw:hidden tw:md:block',
  'tw:hidden tw:xl:block',
  'tw:hidden tw:xl:block',
] as const;

/** Reserves exactly two rows of the current responsive product-card grid while appending. */
export function ProductInfiniteListLoader() {
  return (
    <div
      aria-busy="true"
      aria-label="در حال دریافت محصولات بیشتر"
      className={cn(productGridClassName, 'skeleton tw:pointer-events-none tw:select-none')}
    >
      {productGridSkeletonData.map((product, index) => (
        <div key={product.id} className={twoRowVisibility[index]}>
          <ProductCard product={product} isSkeleton />
        </div>
      ))}
    </div>
  );
}
