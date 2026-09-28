import { PackageCheck } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { routePaths } from '@/configs/route.path';

export function CartEmptyState() {
  return (
    <Empty className="tw:min-h-56 tw:border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageCheck aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle role="heading" aria-level={2}>
          سبد خرید شما خالی است
        </EmptyTitle>
        <EmptyDescription>محصولات مورد نیاز دوست کوچکتان را پیدا کنید.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button nativeButton={false} render={<Link href={routePaths.productsList} />}>
          رفتن به فروشگاه
        </Button>
      </EmptyContent>
    </Empty>
  );
}
