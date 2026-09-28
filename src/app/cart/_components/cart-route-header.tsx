'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'nextjs-toploader/app';

import { Button } from '@/components/ui/button';
import { routePaths } from '@/configs/route.path';
import { useCartStore } from '@/stores/cart.store';
import { useCommonStore } from '@/stores/common.store';

export function CartRouteHeader() {
  const router = useRouter();
  const emptyCart = useCartStore((state) => state.emptyCart);
  const showConfirmDialog = useCommonStore((state) => state.showConfirmDialog);

  function confirmEmptyCart() {
    showConfirmDialog({
      title: 'خالی کردن سبد خرید',
      message: 'همه آیتم‌های سبد خرید شما حذف می‌شوند. آیا مطمئن هستید؟',
      icon: Trash2,
      variant: 'error',
      onSuccess: async () => {
        const result = await emptyCart();
        if (result.isSuccess) router.refresh();
      },
    });
  }

  return (
    <header className="tw:sticky tw:top-0 tw:z-30 tw:grid tw:h-16 tw:grid-cols-[1fr_auto_1fr] tw:items-center tw:border-b tw:border-border/70 tw:bg-background/95 tw:px-3 tw:supports-backdrop-filter:backdrop-blur-xl tw:lg:h-[72px] tw:lg:px-6">
      <Button
        size="sm"
        variant="text"
        className="tw:justify-self-start"
        onClick={() => router.push(routePaths.productsList)}
      >
        ادامه خرید
      </Button>
      <h1 className="tw:text-title-m tw:text-foreground tw:lg:text-title-l">سبد خرید</h1>
      <Button
        iconOnly
        size="sm"
        variant="text"
        color="error"
        aria-label="خالی کردن سبد خرید"
        className="tw:justify-self-end"
        onClick={confirmEmptyCart}
      >
        <Trash2 aria-hidden="true" />
      </Button>
    </header>
  );
}
