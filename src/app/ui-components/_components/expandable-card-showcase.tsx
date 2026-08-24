'use client';

import { Badge } from '@/components/ui/badge';
import { ExpandableCard } from '@/components/ui/expandable-card';

import { ShowcaseSection } from './showcase-section';

export function ExpandableCardShowcase() {
  return (
    <ShowcaseSection
      id="expandable-cards"
      title="Expandable Card"
      description="کارت محتوایی با ارتفاع جمع‌شده، محوشدگی اختیاری و کنترل دسترس‌پذیر باز و بسته شدن."
    >
      <div className="tw:grid tw:items-start tw:gap-5 tw:lg:grid-cols-2">
        <ExpandableCard.Root variant="outlined" size="sm">
          <ExpandableCard.Content collapsedHeight={112}>
            <div className="tw:flex tw:flex-col tw:gap-3">
              <Badge variant="tonal" color="success">
                موجود
              </Badge>
              <h3 className="tw:text-title-s">غذای خشک گربه بالغ</h3>
              <p>
                ترکیب کامل روزانه با پروتئین بالا، ویتامین‌های ضروری و دانه‌بندی مناسب برای گربه‌های
                بالغ. کد محصول <bdi>CAT-8420</bdi>.
              </p>
            </div>
          </ExpandableCard.Content>
          <ExpandableCard.Trigger
            collapsedLabel="نمایش توضیحات کامل"
            expandedLabel="بستن توضیحات"
          />
        </ExpandableCard.Root>

        <ExpandableCard.Root defaultExpanded variant="filled" size="sm">
          <ExpandableCard.Content collapsedHeight={112} showFade={false}>
            <div className="tw:flex tw:flex-col tw:gap-3">
              <Badge variant="tonal" color="info">
                پیش‌فرض باز
              </Badge>
              <h3 className="tw:text-title-s">راهنمای نگهداری</h3>
              <p>
                بسته را دور از نور مستقیم و رطوبت نگهداری کنید و پس از هر بار مصرف، در آن را کاملاً
                ببندید.
              </p>
            </div>
          </ExpandableCard.Content>
          <ExpandableCard.Trigger collapsedLabel="نمایش راهنما" expandedLabel="بستن راهنما" />
        </ExpandableCard.Root>
      </div>
    </ShowcaseSection>
  );
}
