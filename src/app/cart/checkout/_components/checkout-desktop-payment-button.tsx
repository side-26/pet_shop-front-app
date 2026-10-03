'use client';

import { Button } from '@/components/ui/button';
import { useCheckoutStore } from '@/stores/checkout.store';

import { useCheckoutPayment } from './checkout-payment-provider';

export function CheckoutDesktopPaymentButton() {
  const checkoutInformation = useCheckoutStore((state) => state.checkoutInformation);
  const { isPending, requestPayment } = useCheckoutPayment();
  const canPay = Boolean(
    checkoutInformation.addressId &&
    checkoutInformation.deliveryServiceId &&
    checkoutInformation.deliveryDate?.id &&
    checkoutInformation.deliveryTimeSlot?.id,
  );

  return (
    <Button
      block
      size="lg"
      disabled={!canPay}
      isLoading={isPending}
      loadingText="انتقال به درگاه بانکی..."
      onClick={requestPayment}
    >
      {canPay ? 'ادامه و پرداخت' : 'زمان ارسال را انتخاب کنید'}
    </Button>
  );
}
