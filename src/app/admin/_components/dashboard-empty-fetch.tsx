import { ChartNoAxesCombinedIcon } from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export function DashboardEmptyFetch() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ChartNoAxesCombinedIcon aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>آماری برای نمایش وجود ندارد</EmptyTitle>
        <EmptyDescription>با ثبت فعالیت فروشگاه، آمار این بخش نمایش داده می‌شود.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
