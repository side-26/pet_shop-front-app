import { MobileProductTools } from './mobile-product-tools';
import { ProductFilters } from './product-filters';
import { ProductGrid } from './product-grid';
import { ProductListBreadcrumb } from './product-list-breadcrumb';

export function ProductListContent() {
  return (
    <main className="tw:mx-auto tw:flex tw:w-full tw:max-w-7xl tw:flex-col tw:gap-5 tw:px-3 tw:py-5 tw:sm:px-5 tw:md:gap-6 tw:md:px-6 tw:md:py-8 tw:lg:px-8 tw:lg:py-10">
      <ProductListBreadcrumb />

      <header>
        <h1 className="tw:text-heading-2 tw:lg:text-heading-1">محصولات حیوانات خانگی</h1>
      </header>

      <MobileProductTools />

      <div className="tw:grid tw:items-start tw:gap-6 tw:lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="tw:sticky tw:top-28 tw:hidden tw:lg:block" aria-label="فیلتر محصولات">
          <ProductFilters />
        </aside>

        <ProductGrid />
      </div>
    </main>
  );
}
