import { ArrowDownUp, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { routePaths } from '@/configs/route.path';

import { MobileProductTools } from './mobile-product-tools';
import { ProductCard } from './product-card';
import { ProductFilters } from './product-filters';
import { productListItems } from './product-list-data';

const sortOptions = ['محبوب‌ترین', 'جدیدترین', 'ارزان‌ترین', 'گران‌ترین'] as const;

export function ProductListContent() {
  return (
    <main className="tw:mx-auto tw:flex tw:w-full tw:max-w-7xl tw:flex-col tw:gap-5 tw:px-3 tw:py-5 tw:sm:px-5 tw:md:gap-6 tw:md:px-6 tw:md:py-8 tw:lg:px-8 tw:lg:py-10">
      <Breadcrumb aria-label="مسیر صفحه">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={routePaths.home} />}>خانه</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronLeft />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={routePaths.products} />}>فروشگاه</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronLeft />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>محصولات</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header>
        <h1 className="tw:text-heading-2 tw:lg:text-heading-1">محصولات حیوانات خانگی</h1>
      </header>

      <MobileProductTools />

      <div className="tw:grid tw:items-start tw:gap-6 tw:lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="tw:sticky tw:top-28 tw:hidden tw:lg:block" aria-label="فیلتر محصولات">
          <ProductFilters />
        </aside>

        <section
          aria-labelledby="products-grid-heading"
          className="tw:flex tw:min-w-0 tw:flex-col tw:gap-5"
        >
          <div className="tw:hidden tw:items-center tw:justify-between tw:gap-4 tw:rounded-2xl tw:border tw:border-border/70 tw:bg-card tw:p-3 tw:lg:flex">
            <div className="tw:flex tw:items-center tw:gap-2 tw:text-label-m tw:text-muted-foreground">
              <ArrowDownUp aria-hidden="true" />
              <span>مرتب‌سازی:</span>
            </div>
            <div className="tw:flex tw:flex-wrap tw:justify-end tw:gap-1">
              {sortOptions.map((option, index) => (
                <Button
                  key={option}
                  size="sm"
                  variant={index === 0 ? 'tonal' : 'flat'}
                  color={index === 0 ? 'primary' : 'secondary'}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

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
      </div>
    </main>
  );
}
