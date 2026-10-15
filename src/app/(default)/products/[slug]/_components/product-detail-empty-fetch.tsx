import { PackageSearch } from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export function ProductDetailEmptyFetch() {
  return (
    <Empty className="tw:default-layout-container tw:py-12 tw:lg:py-20">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageSearch aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>محصولی برای نمایش یافت نشد</EmptyTitle>
        <EmptyDescription>ممکن است محصول حذف شده باشد یا دیگر در دسترس نباشد.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
