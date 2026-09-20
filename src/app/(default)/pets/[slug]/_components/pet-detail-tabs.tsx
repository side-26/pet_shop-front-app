import { DataGrid } from '@/components/ui/data-grid';
import { RichText } from '@/components/ui/rich-text';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { isRichTextDocument } from '@/lib/rich-text';

import type { PetDetailViewModel } from './pet-detail-data';
import { PetDetailExpandableCard } from './pet-detail-expandable-card';

export function PetDetailTabs({
  pet,
  isSkeleton = false,
}: Readonly<{ pet: PetDetailViewModel; isSkeleton?: boolean }>) {
  const hasOverview = Boolean(pet.descriptionText);
  const hasSpecifications = pet.specifications.length > 0;
  if (!hasOverview && !hasSpecifications) return null;
  return (
    <section aria-label="اطلاعات تکمیلی حیوان" className="tw:mt-8 tw:lg:mt-10">
      <Tabs defaultValue={hasOverview ? 'overview' : 'specifications'} color="primary" size="md">
        <TabsList variant="line" aria-label="بخش‌های اطلاعات حیوان">
          {hasOverview ? <TabsTrigger value="overview">معرفی حیوان</TabsTrigger> : null}
          {hasSpecifications ? <TabsTrigger value="specifications">مشخصات</TabsTrigger> : null}
        </TabsList>
        {hasOverview ? (
          <TabsContent value="overview" className="tw:pt-5">
            <PetDetailExpandableCard
              title="معرفی حیوان"
              collapsedHeight={240}
              isSkeleton={isSkeleton}
            >
              <RichText
                ariaLabel="توضیحات حیوان"
                content={
                  isRichTextDocument(pet.description)
                    ? pet.description
                    : { type: 'doc', content: [] }
                }
                editable={false}
                variant="outlined"
                className="tw:border-0"
              />
            </PetDetailExpandableCard>
          </TabsContent>
        ) : null}
        {hasSpecifications ? (
          <TabsContent value="specifications" className="tw:pt-5">
            <PetDetailExpandableCard title="مشخصات" collapsedHeight={224} isSkeleton={isSkeleton}>
              <DataGrid.Root borderColor="primary" variant="line" size="md">
                {pet.specifications.map((item, index) => (
                  <DataGrid.Item key={`${item.label}-${index}`}>
                    <DataGrid.Label>{item.label}</DataGrid.Label>
                    <DataGrid.Value>{item.value}</DataGrid.Value>
                  </DataGrid.Item>
                ))}
              </DataGrid.Root>
            </PetDetailExpandableCard>
          </TabsContent>
        ) : null}
      </Tabs>
      {isSkeleton ? <span className="tw:sr-only">در حال بارگذاری اطلاعات حیوان</span> : null}
    </section>
  );
}
