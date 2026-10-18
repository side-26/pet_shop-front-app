import { Tags } from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export function PopularBrandsSectionEmptyFetch() {
  return (
    <Empty className="tw:py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Tags aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>برند محبوبی برای نمایش وجود ندارد</EmptyTitle>
        <EmptyDescription>به‌زودی برندهای محبوب جدیدی اضافه می‌شود.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
