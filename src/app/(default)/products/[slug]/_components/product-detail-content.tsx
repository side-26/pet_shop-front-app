import { Bone, CircleCheck, HeartPulse, Star } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { routePaths } from '@/configs/route.path';

import type { ProductDetail } from './product-detail-data';
import { ProductDescription } from './product-description';
import { ProductGallery } from './product-gallery';
import { ProductHeaderActions } from './product-header-actions';
import { ProductPurchaseControls } from './product-purchase-controls';

type ProductDetailContentProps = Readonly<{ product: ProductDetail }>;

export function ProductDetailContent({ product }: ProductDetailContentProps) {
  return (
    <article className="tw:mx-auto tw:w-full tw:max-w-7xl tw:pb-24 tw:lg:pb-12">
      <div className="tw:px-4 tw:py-4 tw:sm:px-6 tw:lg:px-8 tw:lg:py-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href={routePaths.home} />}>خانه</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href={routePaths.productsList} />}>
                {product.animal}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.category}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card
        size="sm"
        variant="elevated"
        className="tw:rounded-none tw:border-x-0 tw:py-0 tw:lg:mx-8 tw:lg:grid tw:lg:grid-cols-2 tw:lg:gap-8 tw:lg:rounded-3xl tw:lg:border tw:lg:p-6"
      >
        <ProductGallery images={product.images} discount={product.discount} />

        <CardContent className="tw:flex tw:flex-col tw:gap-5 tw:px-4 tw:py-5 tw:sm:px-6 tw:lg:px-0 tw:lg:py-1">
          <div className="tw:flex tw:items-start tw:justify-between tw:gap-4">
            <div className="tw:min-w-0">
              <Badge color="error" variant="tonal" className="tw:mb-3 tw:lg:hidden">
                {product.discount}
              </Badge>
              <h1 className="tw:text-title-m tw:leading-8 tw:text-foreground tw:lg:text-title-l">
                {product.title}
              </h1>
            </div>
            <ProductHeaderActions title={product.title} />
          </div>

          <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-x-4 tw:gap-y-2 tw:border-b tw:border-border/70 tw:pb-4 tw:text-label-m">
            <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-warning-active">
              <Star aria-hidden="true" className="tw:size-4 tw:fill-current" />
              <bdi>{product.rating.toLocaleString('fa-IR')}</bdi>
            </span>
            <span className="tw:text-muted-foreground">
              ({product.reviewCount.toLocaleString('fa-IR')} نظر)
            </span>
            <span>
              برند: <strong className="tw:text-primary">{product.brand}</strong>
            </span>
            <span>وزن: {product.weight}</span>
          </div>

          <div className="tw:flex tw:items-center tw:gap-2 tw:text-label-m tw:text-success">
            <CircleCheck aria-hidden="true" className="tw:size-5" />
            موجود در انبار
          </div>

          <ProductPurchaseControls
            mode="desktop"
            price={product.price}
            previousPrice={product.previousPrice}
            stock={product.stock}
          />

          <div>
            <h2 className="tw:mb-3 tw:text-title-s">انتخاب وزن</h2>
            <ToggleGroup
              aria-label="انتخاب وزن"
              defaultValue={[product.weights[0].value]}
              spacing={2}
            >
              {product.weights.map((weight) => (
                <ToggleGroupItem key={weight.value} value={weight.value}>
                  {weight.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="tw:grid tw:grid-cols-2 tw:gap-3">
            <Card size="xs" variant="filled" className="tw:rounded-2xl tw:bg-success-muted/70">
              <CardContent className="tw:flex tw:items-center tw:gap-3">
                <span className="tw:flex tw:size-10 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-xl tw:bg-success tw:text-success-foreground">
                  <Bone aria-hidden="true" className="tw:size-5" />
                </span>
                <div>
                  <h3 className="tw:text-label-m">تقویت استخوان‌ها</h3>
                  <p className="tw:mt-0.5 tw:text-label-s tw:text-muted-foreground">
                    حاوی کلسیم و فسفر
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card size="xs" variant="filled" className="tw:rounded-2xl tw:bg-info-muted/70">
              <CardContent className="tw:flex tw:items-center tw:gap-3">
                <span className="tw:flex tw:size-10 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-xl tw:bg-info tw:text-info-foreground">
                  <HeartPulse aria-hidden="true" className="tw:size-5" />
                </span>
                <div>
                  <h3 className="tw:text-label-m">هضم آسان</h3>
                  <p className="tw:mt-0.5 tw:text-label-s tw:text-muted-foreground">
                    پروتئین با کیفیت بالا
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <ProductDescription description={product.description} />
        </CardContent>
      </Card>

      <ProductPurchaseControls
        mode="mobile"
        price={product.price}
        previousPrice={product.previousPrice}
        stock={product.stock}
      />
    </article>
  );
}
