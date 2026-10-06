import { Package } from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export function ProfileOrdersEmpty() {
  return (
    <Empty className="tw:border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Package aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>هنوز سفارشی ثبت نکرده‌اید</EmptyTitle>
        <EmptyDescription>
          پس از ثبت نخستین سفارش، وضعیت و جزئیات ارسال آن را از این بخش می‌بینید.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
