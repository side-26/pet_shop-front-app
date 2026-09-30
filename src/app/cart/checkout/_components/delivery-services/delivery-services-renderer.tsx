'use client';

import { Truck } from 'lucide-react';
import { useEffect } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup } from '@/components/ui/fields/radio-group';
import { cn } from '@/lib/utils';
import { useCheckoutStore } from '@/stores/checkout.store';

import { DeliveryServiceOption } from './delivery-service-option';
import { CheckoutDeliveryServicesEmpty } from './delivery-services-empty';
import type { CheckoutDeliveryServiceViewModel } from './delivery-services.types';

type DeliveryServicesRendererProps = Readonly<{
  hasSelectedAddress: boolean;
  isSkeleton?: boolean;
  services: readonly CheckoutDeliveryServiceViewModel[];
}>;

export function CheckoutDeliveryServicesRenderer({
  hasSelectedAddress,
  isSkeleton = false,
  services,
}: DeliveryServicesRendererProps) {
  const deliveryServiceId = useCheckoutStore(
    (state) => state.checkoutInformation.deliveryServiceId,
  );
  const deliveryServiceAvailability = useCheckoutStore(
    (state) => state.checkoutInformation.deliveryServiceAvailability,
  );
  const saveCheckoutInformation = useCheckoutStore((state) => state.saveCheckoutInformation);
  const setDeliveryPrices = useCheckoutStore((state) => state.setDeliveryPrices);

  function selectDeliveryService(service: CheckoutDeliveryServiceViewModel) {
    saveCheckoutInformation({
      deliveryServiceId: service.id,
      deliveryServiceAvailability: service.availability,
      deliveryDate: undefined,
      deliveryTimeSlot: undefined,
    });
    setDeliveryPrices(service.calculatedPricePerKilometer, service.packingPrice);
  }

  useEffect(() => {
    if (isSkeleton || services.length === 0) return;

    const selectedService =
      services.find((service) => service.id === deliveryServiceId) ?? services[0];
    if (
      selectedService.id === deliveryServiceId &&
      selectedService.availability === deliveryServiceAvailability
    ) {
      return;
    }

    saveCheckoutInformation({
      deliveryServiceId: selectedService.id,
      deliveryServiceAvailability: selectedService.availability,
    });
    setDeliveryPrices(selectedService.calculatedPricePerKilometer, selectedService.packingPrice);
  }, [
    deliveryServiceAvailability,
    deliveryServiceId,
    isSkeleton,
    saveCheckoutInformation,
    setDeliveryPrices,
    services,
  ]);

  return (
    <section
      aria-busy={isSkeleton || undefined}
      className={cn(isSkeleton && 'skeleton tw:pointer-events-none tw:select-none')}
    >
      <Card variant="elevated" size="md">
        <CardHeader>
          <CardTitle className="tw:flex tw:items-center tw:gap-2">
            <Truck aria-hidden="true" className="tw:size-5 tw:text-primary" />
            سرویس ارسال
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isSkeleton ? (
            <RadioGroup
              aria-label="انتخاب سرویس ارسال"
              className="tw:flex tw:flex-col tw:gap-3"
              value={deliveryServiceId ?? ''}
            >
              {services.map((service) => (
                <DeliveryServiceOption
                  key={service.id}
                  isSelected={false}
                  isSkeleton
                  service={service}
                />
              ))}
            </RadioGroup>
          ) : services.length === 0 ? (
            <CheckoutDeliveryServicesEmpty hasSelectedAddress={hasSelectedAddress} />
          ) : (
            <RadioGroup
              aria-label="انتخاب سرویس ارسال"
              className="tw:flex tw:flex-col tw:gap-3"
              onValueChange={(serviceId) => {
                const service = services.find((candidate) => candidate.id === serviceId);
                if (service) selectDeliveryService(service);
              }}
              value={deliveryServiceId ?? ''}
            >
              {services.map((service) => (
                <DeliveryServiceOption
                  key={service.id}
                  isSelected={deliveryServiceId === service.id}
                  service={service}
                />
              ))}
            </RadioGroup>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
