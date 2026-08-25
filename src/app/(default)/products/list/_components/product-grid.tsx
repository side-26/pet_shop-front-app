import { Button } from '@/components/ui/button';
import { ListingSortToolbar } from '@/components/common/listing-sort-toolbar';

import { ProductCard } from './product-card';
import { productListItems } from './product-list-data';

const sortOptions = ['محبوب‌ترین', 'جدیدترین', 'ارزان‌ترین', 'گران‌ترین'] as const;

export function ProductGrid() {
  return (
    <section
      aria-labelledby="products-grid-heading"
      className="tw:flex tw:min-w-0 tw:flex-col tw:gap-5"
    >
      <ListingSortToolbar options={sortOptions} />
      <h2 id="products-grid-heading" className="tw:sr-only">
        فهرست محصولات
      </h2>
      <div className="tw:grid tw:grid-cols-1 tw:gap-3 tw:min-[360px]:grid-cols-2 tw:md:grid-cols-3 tw:md:gap-4 tw:xl:grid-cols-4 tw:xl:gap-5">
        {productListItems.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Button size="lg" variant="outlined" className="tw:self-center tw:px-10">
        مشاهده محصولات بیشتر
      </Button>
    </section>
  );
}
