import { PawPrint } from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export function PetDetailEmptyFetch() {
  return (
    <Empty className="tw:default-layout-container tw:py-12 tw:lg:py-20">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PawPrint aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>حیوانی برای نمایش یافت نشد</EmptyTitle>
        <EmptyDescription>ممکن است این حیوان دیگر در دسترس نباشد.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
