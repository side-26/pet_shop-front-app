import { Truck } from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export function CheckoutDeliveryServicesEmpty({
  hasSelectedAddress,
}: Readonly<{ hasSelectedAddress: boolean }>) {
  return (
    <Empty className="tw:border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Truck aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>
          {hasSelectedAddress
            ? 'سرویس ارسالی برای این نشانی پیدا نشد'
            : 'ابتدا نشانی تحویل را انتخاب کنید'}
        </EmptyTitle>
        <EmptyDescription>
          {hasSelectedAddress
            ? 'در حال حاضر هیچ سرویس ارسالی برای محدوده این نشانی در دسترس نیست.'
            : 'پس از انتخاب نشانی، سرویس‌های ارسال قابل استفاده نمایش داده می‌شوند.'}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
