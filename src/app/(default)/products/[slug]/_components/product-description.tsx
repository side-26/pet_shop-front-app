'use client';

import { ExpandableCard } from '@/components/ui/expandable-card';

type ProductDescriptionProps = Readonly<{ description: string }>;

export function ProductDescription({ description }: ProductDescriptionProps) {
  return (
    <ExpandableCard.Root size="sm" variant="outlined" className="tw:rounded-2xl">
      <ExpandableCard.Content collapsedHeight={130} className="tw:space-y-3">
        <h2 className="tw:text-title-s">معرفی محصول</h2>
        <p className="tw:text-body-m tw:leading-8 tw:text-muted-foreground">{description}</p>
      </ExpandableCard.Content>
      <ExpandableCard.Trigger collapsedLabel="مشاهده بیشتر" expandedLabel="مشاهده کمتر" />
    </ExpandableCard.Root>
  );
}
