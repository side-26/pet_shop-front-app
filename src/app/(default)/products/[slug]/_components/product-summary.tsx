'use client';

import { ExpandableCard } from '@/components/ui/expandable-card';
import { ExpandableDrawer } from '@/components/common/expandable-drawer';

type ProductSummaryProps = Readonly<{
  summary: string;
}>;

export function ProductSummary({ summary }: ProductSummaryProps) {
  if (!summary) return null;

  return (
    <section aria-label="خلاصه محصول" className="tw:mt-8 tw:lg:mt-10">
      <div className="tw:lg:hidden">
        <h2 className="tw:px-4 tw:pt-4 tw:text-title-s">خلاصه محصول</h2>
        <ExpandableDrawer
          title="خلاصه محصول"
          collapsedHeight={130}
          showMoreLabel="مشاهده خلاصه محصول"
          sectionChildren={
            <p className="tw:text-body-m tw:leading-8 tw:text-muted-foreground">{summary}</p>
          }
          drawerChildren={
            <p className="tw:text-body-m tw:leading-8 tw:text-muted-foreground">{summary}</p>
          }
        />
      </div>
      <div className="tw:hidden tw:lg:block">
        <ExpandableCard.Root size="sm" variant="outlined" className="tw:rounded-2xl">
          <ExpandableCard.Content collapsedHeight={130} className="tw:flex tw:flex-col tw:gap-3">
            <h2 id="product-summary-title" className="tw:text-title-s">
              خلاصه محصول
            </h2>
            <p className="tw:text-body-m tw:leading-8 tw:text-muted-foreground">{summary}</p>
          </ExpandableCard.Content>
          <ExpandableCard.Trigger collapsedLabel="مشاهده بیشتر" expandedLabel="مشاهده کمتر" />
        </ExpandableCard.Root>
      </div>
    </section>
  );
}
