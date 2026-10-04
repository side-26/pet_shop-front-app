'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';

import { usePrepareOrderMutation } from '@/entities/orders/orders.client';
import { useRequestPaymentMutation } from '@/entities/payments/payments.client';
import { usePreventPageLeave } from '@/hooks/use-prevent-page-leave';
import { useCartStore } from '@/stores/cart.store';
import { useCheckoutStore } from '@/stores/checkout.store';

type CheckoutPaymentContextValue = Readonly<{
  isPending: boolean;
  requestPayment: () => void;
}>;

const CheckoutPaymentContext = createContext<CheckoutPaymentContextValue | null>(null);

export function CheckoutPaymentProvider({ children }: Readonly<{ children: ReactNode }>) {
  const { isPending: isPreparingOrder, mutateAsync: prepareOrderMutation } =
    usePrepareOrderMutation();
  const { isPending: isRequestingPayment, mutateAsync: requestPaymentMutation } =
    useRequestPaymentMutation();
  const paymentRequestInFlight = useRef(false);
  const isPending = isPreparingOrder || isRequestingPayment;

  const { allowNextUnload } = usePreventPageLeave({
    force: isPending,
    message: 'درخواست پرداخت در حال انجام است. لطفاً تا انتقال به درگاه بانکی صبر کنید.',
  });

  async function requestPayment() {
    if (paymentRequestInFlight.current) return;
    paymentRequestInFlight.current = true;

    const { checkoutInformation } = useCheckoutStore.getState();
    const { addressId, deliveryDate, deliveryServiceId, deliveryTimeSlot } = checkoutInformation;
    if (!addressId || !deliveryServiceId || !deliveryDate?.id || !deliveryTimeSlot?.id) {
      paymentRequestInFlight.current = false;
      return;
    }

    try {
      const cartSync = await useCartStore.getState().syncLocalToServer();
      if (!cartSync.isSuccess) return;

      const { orderId } = await prepareOrderMutation({
        addressId,
        deliveryServiceId,
        deliveryDateId: deliveryDate.id,
        deliveryTimeSlotId: deliveryTimeSlot.id,
      });
      const { gatewayUrl } = await requestPaymentMutation({ orderId });
      allowNextUnload();
      window.location.assign(gatewayUrl);
    } finally {
      paymentRequestInFlight.current = false;
    }
  }

  return (
    <CheckoutPaymentContext.Provider value={{ isPending, requestPayment }}>
      {children}
    </CheckoutPaymentContext.Provider>
  );
}

export function useCheckoutPayment() {
  const context = useContext(CheckoutPaymentContext);
  if (!context) throw new Error('useCheckoutPayment must be used within CheckoutPaymentProvider.');
  return context;
}
