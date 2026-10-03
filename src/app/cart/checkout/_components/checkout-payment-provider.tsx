'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';

import { usePrepareOrderMutation } from '@/entities/orders/orders.client';
import { useRequestPaymentMutation } from '@/entities/payments/payments.client';
import { usePreventPageLeave } from '@/hooks/use-prevent-page-leave';
import { useCheckoutStore } from '@/stores/checkout.store';

type CheckoutPaymentContextValue = Readonly<{
  isPending: boolean;
  requestPayment: () => void;
}>;

const CheckoutPaymentContext = createContext<CheckoutPaymentContextValue | null>(null);

export function CheckoutPaymentProvider({ children }: Readonly<{ children: ReactNode }>) {
  const { isPending: isPreparingOrder, mutate: prepareOrderMutation } = usePrepareOrderMutation();
  const { isPending: isRequestingPayment, mutate: requestPaymentMutation } =
    useRequestPaymentMutation();
  const paymentRequestInFlight = useRef(false);
  const isPending = isPreparingOrder || isRequestingPayment;

  usePreventPageLeave({
    force: isPending,
    message: 'درخواست پرداخت در حال انجام است. لطفاً تا انتقال به درگاه بانکی صبر کنید.',
  });

  function requestPayment() {
    if (paymentRequestInFlight.current) return;
    paymentRequestInFlight.current = true;

    const { checkoutInformation } = useCheckoutStore.getState();
    const { addressId, deliveryDate, deliveryServiceId, deliveryTimeSlot } = checkoutInformation;
    if (!addressId || !deliveryServiceId || !deliveryDate?.id || !deliveryTimeSlot?.id) {
      paymentRequestInFlight.current = false;
      return;
    }

    prepareOrderMutation(
      {
        addressId,
        deliveryServiceId,
        deliveryDateId: deliveryDate.id,
        deliveryTimeSlotId: deliveryTimeSlot.id,
      },
      {
        onError: () => {
          paymentRequestInFlight.current = false;
        },
        onSuccess: ({ orderId }) => {
          requestPaymentMutation(
            { orderId },
            {
              onSuccess: ({ gatewayUrl }) => window.location.assign(gatewayUrl),
              onSettled: () => {
                paymentRequestInFlight.current = false;
              },
            },
          );
        },
      },
    );
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
