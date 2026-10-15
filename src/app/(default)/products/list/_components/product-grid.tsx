import { PackageSearch } from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import type { LandingProductListItemDTO } from '@/entities/landing/landing.dto';
import { cn } from '@/lib/utils';

import { ProductCard } from './product-card';

type ProductGridProps = Readonly<{
  isSkeleton?: boolean;
  products: readonly LandingProductListItemDTO[];
}>;

export const productGridClassName =
  'tw:grid tw:grid-cols-1 tw:gap-3 tw:min-[360px]:grid-cols-2 tw:md:grid-cols-3 tw:md:gap-4 tw:xl:grid-cols-4 tw:xl:gap-5';

export function ProductGrid({ isSkeleton = false, products }: ProductGridProps) {
  if (!isSkeleton && products.length === 0) {
    return (
      <Empty className="tw:border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <PackageSearch aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>محصولی پیدا نشد</EmptyTitle>
          <EmptyDescription>
            فیلترها یا مرتب‌سازی را تغییر دهید و دوباره تلاش کنید.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div
      aria-busy={isSkeleton || undefined}
      className={cn(
        productGridClassName,
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} isSkeleton={isSkeleton} />
      ))}
    </div>
  );
}

export const productGridSkeletonData: readonly LandingProductListItemDTO[] = Array.from(
  { length: 8 },
  (_, index) => ({
    available: true,
    discountPrice: 100_000,
    discountPercentage: 0,
    id: `product-skeleton-${index}`,
    image: '',
    imageThumbnail: '',
    price: 100_000,
    slug: 'product-skeleton',
    title: 'عنوان نمونه محصول',
  }),
);
