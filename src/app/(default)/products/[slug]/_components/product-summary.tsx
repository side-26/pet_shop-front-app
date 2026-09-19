'use client';

import { ExpandableCard } from '@/components/ui/expandable-card';

type ProductSummaryProps = Readonly<{
  summary: string;
}>;

export function ProductSummary({ summary }: ProductSummaryProps) {
  if (!summary) return null;

  return (
    <section aria-labelledby="product-summary-title" className="tw:mt-8 tw:lg:mt-10">
      <ExpandableCard.Root size="sm" variant="outlined" className="tw:rounded-2xl">
        <ExpandableCard.Content collapsedHeight={130} className="tw:flex tw:flex-col tw:gap-3">
          <h2 id="product-summary-title" className="tw:text-title-s">
            خلاصه محصول
          </h2>
          <p className="tw:text-body-m tw:leading-8 tw:text-muted-foreground">{summary}</p>
        </ExpandableCard.Content>
        <ExpandableCard.Trigger collapsedLabel="مشاهده بیشتر" expandedLabel="مشاهده کمتر" />
      </ExpandableCard.Root>
    </section>
  );
}
