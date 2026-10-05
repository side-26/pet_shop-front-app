'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'nextjs-toploader/app';

import { Button } from '@/components/ui/button';
import { Countdown } from '@/components/ui/countdown';
import { routePaths } from '@/configs/route.path';
import { emptyCartAction } from '@/entities/users/users.actions';
import { usePreventPageLeave } from '@/hooks/use-prevent-page-leave';
import { useCartStore } from '@/stores/cart.store';

const REDIRECT_DELAY_SECONDS = 10;

type PaymentResultClientActionsProps = Readonly<{
  isSuccess: boolean;
}>;

export function PaymentResultClientActions({ isSuccess }: PaymentResultClientActionsProps) {
  const router = useRouter();
  const clearLocalCart = useCartStore((state) => state.clearCart);
  const [isClearingCart, setIsClearingCart] = useState(isSuccess);
  const [canNavigate, setCanNavigate] = useState(!isSuccess);
  const [clearError, setClearError] = useState<string | null>(null);
  const hasStartedClearing = useRef(false);
  const destination = isSuccess ? routePaths.profile : routePaths.checkout;
  const destinationLabel = isSuccess ? 'مشاهده سفارش‌ها' : 'بازگشت به تکمیل سفارش';

  usePreventPageLeave({
    force: isClearingCart,
    message: 'در حال تکمیل پرداخت و پاک‌سازی سبد خرید هستیم. لطفاً صبر کنید.',
  });

  const clearCart = useCallback(async () => {
    const result = await emptyCartAction({ idempotencyKey: crypto.randomUUID() });
    if (!result?.isSuccess) {
      setClearError(result?.message ?? 'پاک‌سازی سبد خرید انجام نشد. لطفاً دوباره تلاش کنید.');
      setIsClearingCart(false);
      return;
    }

    clearLocalCart();
    setCanNavigate(true);
    setIsClearingCart(false);
  }, [clearLocalCart]);

  useEffect(() => {
    if (!isSuccess || hasStartedClearing.current) return;

    hasStartedClearing.current = true;
    void clearCart();
  }, [clearCart, isSuccess]);

  useEffect(() => {
    if (!canNavigate) return;

    const redirectTimer = window.setTimeout(
      () => router.replace(destination),
      REDIRECT_DELAY_SECONDS * 1000,
    );
    return () => window.clearTimeout(redirectTimer);
  }, [canNavigate, destination, router]);

  const retryClearCart = () => {
    if (!isSuccess) {
      router.replace(destination);
      return;
    }

    hasStartedClearing.current = false;
    setClearError(null);
    setIsClearingCart(true);
    hasStartedClearing.current = true;
    void clearCart();
  };

  return (
    <div className="tw:flex tw:w-full tw:flex-col tw:items-center tw:gap-4">
      {canNavigate ? (
        <div className="tw:text-body-s tw:text-muted-foreground" aria-live="polite">
          انتقال خودکار تا
          <Countdown
            seconds={REDIRECT_DELAY_SECONDS}
            size="sm"
            color={isSuccess ? 'success' : 'error'}
            className="tw:mx-2 tw:align-middle"
          />
          دیگر
        </div>
      ) : null}
      {clearError ? (
        <p role="alert" className="tw:text-body-s tw:text-error">
          {clearError}
        </p>
      ) : null}
      <Button
        size="lg"
        block
        color={isSuccess ? 'success' : 'error'}
        isLoading={isClearingCart}
        loadingText="در حال پاک‌سازی سبد خرید..."
        onClick={canNavigate ? () => router.replace(destination) : retryClearCart}
      >
        {destinationLabel}
      </Button>
    </div>
  );
}
