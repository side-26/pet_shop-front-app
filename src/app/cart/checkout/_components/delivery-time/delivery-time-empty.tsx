import { CalendarDays } from 'lucide-react';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export function DeliveryTimeEmpty() {
  return (
    <Empty className="tw:border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CalendarDays aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>زمان تحویل را انتخاب کنید</EmptyTitle>
        <EmptyDescription>
          پس از انتخاب سرویس ارسال، روزها و بازه‌های زمانی قابل انتخاب نمایش داده می‌شوند.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
