import { HeartOff } from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export function WishListEmptyFetch() {
  return (
    <Empty className="tw:py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HeartOff aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>هنوز علاقه‌مندی‌ای ندارید</EmptyTitle>
        <EmptyDescription>
          با انتخاب قلب کنار محصولات و حیوانات، آن‌ها را برای بعد ذخیره کنید.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
