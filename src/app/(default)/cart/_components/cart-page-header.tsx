import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { routePaths } from '@/configs/route.path';

export function CartPageHeader() {
  return (
    <header className="tw:flex tw:items-center tw:justify-between tw:gap-4">
      <h1 className="tw:text-heading-2 tw:text-foreground">سبد خرید</h1>
      <Button nativeButton={false} render={<Link href={routePaths.productsList} />} variant="text">
        ادامه خرید
        <ChevronLeft data-icon="inline-end" aria-hidden="true" />
      </Button>
    </header>
  );
}
