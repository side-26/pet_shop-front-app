import { PackageSearch } from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export function FeaturedProductsSectionEmptyFetch() {
  return (
    <Empty className="tw:py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageSearch aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>محصول محبوبی برای نمایش وجود ندارد</EmptyTitle>
        <EmptyDescription>به‌زودی محصولات محبوب جدیدی اضافه می‌شود.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
