import { ExpandableDrawer } from '@/components/common/expandable-drawer';

import { PetDetailExpandableCard } from './pet-detail-expandable-card';

type PetDetailSummaryProps = Readonly<{
  isSkeleton: boolean;
  summary: string;
}>;

export function PetDetailSummary({ isSkeleton, summary }: PetDetailSummaryProps) {
  if (!summary) return null;

  const content = <p className="tw:text-body-m tw:leading-8 tw:text-muted-foreground">{summary}</p>;

  return (
    <section aria-label="خلاصه حیوان" className="tw:col-span-3">
      <div className="tw:lg:hidden">
        <h2 className="tw:px-4 tw:pt-4 tw:text-title-s">خلاصه حیوان</h2>
        <ExpandableDrawer
          title="خلاصه حیوان"
          collapsedHeight={112}
          disabled={isSkeleton}
          showMoreLabel="نمایش خلاصه حیوان"
          sectionChildren={content}
          drawerChildren={content}
        />
      </div>
      <div className="tw:hidden tw:lg:block">
        <PetDetailExpandableCard title="خلاصه حیوان" collapsedHeight={112} isSkeleton={isSkeleton}>
          {content}
        </PetDetailExpandableCard>
      </div>
    </section>
  );
}
