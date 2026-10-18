import { Tags } from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export function ProductCategoriesSectionEmptyFetch() {
  return (
    <Empty className="tw:py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Tags aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>دسته‌بندی فعالی برای نمایش وجود ندارد</EmptyTitle>
        <EmptyDescription>به‌زودی دسته‌بندی‌های محصولات اضافه می‌شود.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
