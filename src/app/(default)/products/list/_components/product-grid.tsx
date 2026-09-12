import { PackageSearch } from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import type { CustomerProductListItemDTO } from '@/entities/products/products.dto';
import { cn } from '@/lib/utils';

import { ProductCard, type ProductCardViewModel } from './product-card';

type ProductGridProps = Readonly<{
  isSkeleton?: boolean;
  products: readonly ProductCardViewModel[];
}>;

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
        'tw:grid tw:grid-cols-1 tw:gap-3 tw:min-[360px]:grid-cols-2 tw:md:grid-cols-3 tw:md:gap-4 tw:xl:grid-cols-4 tw:xl:gap-5',
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} isSkeleton={isSkeleton} />
      ))}
    </div>
  );
}

export function toProductCardViewModel(product: CustomerProductListItemDTO): ProductCardViewModel {
  return {
    available: product.isEnable && product.quantity > 0,
    brand: product.brand,
    category: product.category,
    discountPercentage: product.discountPercentage,
    id: product.id,
    image: product.mainImage,
    imageThumbnail: product.mainImageThumbnail,
    price: product.price,
    slug: product.slug,
    title: product.title,
  };
}

export const productGridSkeletonData: readonly ProductCardViewModel[] = Array.from(
  { length: 8 },
  (_, index) => ({
    available: true,
    brand: 'برند نمونه',
    category: 'دسته نمونه',
    discountPercentage: 0,
    id: `product-skeleton-${index}`,
    image: '',
    imageThumbnail: '',
    price: 100_000,
    slug: 'product-skeleton',
    title: 'عنوان نمونه محصول',
  }),
);
