'use client';

import { ExpandableCard } from '@/components/ui/expandable-card';
import { RichText } from '@/components/ui/rich-text';
import { isRichTextDocument } from '@/lib/rich-text';

import type { ProductDetailViewModel } from './product-detail-data';

type ProductOverviewProps = Readonly<{
  product: ProductDetailViewModel;
}>;

export function ProductOverview({ product }: ProductOverviewProps) {
  const hasDescription = product.description && isRichTextDocument(product.description);

  return (
    <ExpandableCard.Root size="sm" variant="outlined" className="tw:rounded-2xl">
      <ExpandableCard.Content collapsedHeight={180} className="tw:flex tw:flex-col tw:gap-4">
        {!hasDescription && product.descriptionText ? (
          <p className="tw:text-body-m tw:leading-8 tw:text-muted-foreground">
            {product.descriptionText}
          </p>
        ) : null}
        {hasDescription ? (
          <RichText
            ariaLabel="توضیحات محصول"
            content={product.description}
            editable={false}
            variant="outlined"
            className="tw:border-border"
          />
        ) : null}
      </ExpandableCard.Content>
      <ExpandableCard.Trigger collapsedLabel="مشاهده بیشتر" expandedLabel="مشاهده کمتر" />
    </ExpandableCard.Root>
  );
}
