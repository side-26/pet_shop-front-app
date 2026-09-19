import { DataGrid } from '@/components/ui/data-grid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import type { ProductDetailViewModel } from './product-detail-data';
import { ProductOverview } from './product-overview';

type ProductDetailTabsProps = Readonly<{
  isSkeleton?: boolean;
  product: ProductDetailViewModel;
}>;

export function ProductDetailTabs({ isSkeleton, product }: ProductDetailTabsProps) {
  const hasOverview = Boolean(product.descriptionText);
  const hasSpecifications = product.specifications.length > 0;
  if (!hasOverview && !hasSpecifications) return null;

  const defaultTab = hasOverview ? 'overview' : 'specifications';

  return (
    <section aria-label="اطلاعات تکمیلی محصول" className="tw:mt-8 tw:lg:mt-10">
      <Tabs defaultValue={defaultTab} color="primary" size="md">
        <TabsList variant="line" aria-label="بخش‌های اطلاعات محصول">
          {hasOverview ? <TabsTrigger value="overview">معرفی محصول</TabsTrigger> : null}
          {hasSpecifications ? <TabsTrigger value="specifications">مشخصات</TabsTrigger> : null}
        </TabsList>

        {hasOverview ? (
          <TabsContent value="overview" className="tw:pt-5">
            <ProductOverview product={product} />
          </TabsContent>
        ) : null}

        {hasSpecifications ? (
          <TabsContent value="specifications" className="tw:pt-5">
            <DataGrid.Root borderColor="primary" variant="line" size="md">
              {product.specifications.map((specification, index) => (
                <DataGrid.Item key={`${specification.label}-${index}`}>
                  <DataGrid.Label>{specification.label}</DataGrid.Label>
                  <DataGrid.Value>{specification.value}</DataGrid.Value>
                </DataGrid.Item>
              ))}
            </DataGrid.Root>
          </TabsContent>
        ) : null}
      </Tabs>
      {isSkeleton ? <span className="tw:sr-only">در حال بارگذاری اطلاعات محصول</span> : null}
    </section>
  );
}
