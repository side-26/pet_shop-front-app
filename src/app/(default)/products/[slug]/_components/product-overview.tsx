'use client';

import { ExpandableCard } from '@/components/ui/expandable-card';
import { ExpandableDrawer } from '@/components/common/expandable-drawer';
import { RichText } from '@/components/ui/rich-text';
import { isRichTextDocument } from '@/lib/rich-text';

import type { ProductDetailViewModel } from './product-detail-data';

type ProductOverviewProps = Readonly<{
  product: ProductDetailViewModel;
}>;

export function ProductOverview({ product }: ProductOverviewProps) {
  return (
    <>
      <div className="tw:lg:hidden">
        <ExpandableDrawer
          title="معرفی محصول"
          collapsedHeight={180}
          showMoreLabel="مشاهده معرفی محصول"
          sectionChildren={<ProductOverviewContent product={product} />}
          drawerChildren={
            <ProductOverviewContent ariaLabel="توضیحات کامل محصول" product={product} />
          }
        />
      </div>
      <div className="tw:hidden tw:lg:block">
        <ExpandableCard.Root size="sm" variant="outlined" className="tw:rounded-2xl">
          <ExpandableCard.Content collapsedHeight={180} className="tw:flex tw:flex-col tw:gap-4">
            <ProductOverviewContent product={product} />
          </ExpandableCard.Content>
          <ExpandableCard.Trigger collapsedLabel="مشاهده بیشتر" expandedLabel="مشاهده کمتر" />
        </ExpandableCard.Root>
      </div>
    </>
  );
}

function ProductOverviewContent({
  ariaLabel = 'توضیحات محصول',
  product,
}: ProductOverviewProps & Readonly<{ ariaLabel?: string }>) {
  if (isRichTextDocument(product.description)) {
    return (
      <RichText
        ariaLabel={ariaLabel}
        content={product.description}
        editable={false}
        variant="outlined"
        className="tw:border-border"
      />
    );
  }

  if (product.descriptionText) {
    return (
      <p className="tw:text-body-m tw:leading-8 tw:text-muted-foreground">
        {product.descriptionText}
      </p>
    );
  }

  return null;
}
