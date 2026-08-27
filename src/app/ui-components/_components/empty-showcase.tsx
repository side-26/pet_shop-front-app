import { PackageOpenIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

import { ShowcaseSection } from './showcase-section';

export function EmptyShowcase() {
  return (
    <ShowcaseSection
      id="empty-states"
      title="Empty"
      description="نمایش وضعیت خالی با رسانه، توضیح و اقدام اختیاری در چیدمان راست‌به‌چپ."
    >
      <div className="tw:grid tw:gap-6 tw:md:grid-cols-2">
        <Empty className="tw:border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PackageOpenIcon aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle role="heading" aria-level={4}>
              هنوز محصولی ثبت نشده است
            </EmptyTitle>
            <EmptyDescription>
              نخستین محصول فروشگاه را اضافه کنید تا در این بخش نمایش داده شود.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button type="button">افزودن محصول</Button>
          </EmptyContent>
        </Empty>

        <Empty className="tw:bg-muted/50">
          <EmptyHeader>
            <EmptyTitle role="heading" aria-level={4}>
              نتیجه‌ای پیدا نشد
            </EmptyTitle>
            <EmptyDescription>فیلترهای جست‌وجو را تغییر دهید و دوباره تلاش کنید.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    </ShowcaseSection>
  );
}
