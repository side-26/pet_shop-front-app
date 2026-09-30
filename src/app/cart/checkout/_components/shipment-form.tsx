'use client';

import { CalendarDays } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field/default';
import { FieldLabel } from '@/components/ui/field/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/fields/radio-group';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useCheckoutStore } from '@/stores/checkout.store';

import type { DeliveryDate, DeliveryTimeSlot } from './checkout-data';
import { CheckoutOrderSummary } from './checkout-order-summary';

type ShipmentFormProps = Readonly<{
  addressSelection: ReactNode;
  deliveryServicesSelection: ReactNode;
  deliveryDates: readonly DeliveryDate[];
  deliveryTimeSlots: readonly DeliveryTimeSlot[];
  items: readonly Readonly<{ id: string; title: string; image: string; quantity: number }>[];
  totals: Readonly<{ merchandise: number; discount: number; payable: number }>;
}>;

export function ShipmentForm({
  addressSelection,
  deliveryServicesSelection,
  deliveryDates,
  deliveryTimeSlots,
  items,
  totals,
}: ShipmentFormProps) {
  const selectedDate = useCheckoutStore((state) => state.checkoutInformation.deliveryDate);
  const selectedTimeSlot = useCheckoutStore((state) => state.checkoutInformation.deliveryTimeSlot);
  const saveCheckoutInformation = useCheckoutStore((state) => state.saveCheckoutInformation);
  const deliveryDateId = selectedDate?.id;
  const timeSlotId = selectedTimeSlot?.id;
  const shippingPrice = 0;

  useEffect(() => {
    const defaultDate = deliveryDates[0];
    const defaultTimeSlot = deliveryTimeSlots[0];

    if ((selectedDate || !defaultDate) && (selectedTimeSlot || !defaultTimeSlot)) return;

    saveCheckoutInformation({
      ...(selectedDate || !defaultDate ? {} : { deliveryDate: defaultDate }),
      ...(selectedTimeSlot || !defaultTimeSlot ? {} : { deliveryTimeSlot: defaultTimeSlot }),
    });
  }, [deliveryDates, deliveryTimeSlots, saveCheckoutInformation, selectedDate, selectedTimeSlot]);

  function selectDeliveryDate(deliveryDateId: string) {
    const deliveryDate = deliveryDates.find((date) => date.id === deliveryDateId);
    if (deliveryDate) saveCheckoutInformation({ deliveryDate });
  }

  function selectDeliveryTimeSlot(deliveryTimeSlotId: string) {
    const deliveryTimeSlot = deliveryTimeSlots.find((slot) => slot.id === deliveryTimeSlotId);
    if (deliveryTimeSlot) saveCheckoutInformation({ deliveryTimeSlot });
  }

  return (
    <div className="tw:grid tw:items-start tw:gap-6 tw:lg:grid-cols-[minmax(0,1fr)_22rem] tw:xl:gap-8">
      <div className="tw:flex tw:min-w-0 tw:flex-col tw:gap-6">
        {addressSelection}
        {deliveryServicesSelection}

        <Card variant="elevated" size="md">
          <CardHeader>
            <CardTitle className="tw:flex tw:items-center tw:gap-2">
              <CalendarDays aria-hidden="true" className="tw:size-5 tw:text-primary" />
              زمان تحویل
            </CardTitle>
          </CardHeader>
          <CardContent className="tw:flex tw:flex-col tw:gap-5">
            <div className="tw:flex tw:flex-col tw:gap-3">
              <p className="tw:text-label-l tw:text-card-foreground">روز تحویل</p>
              <RadioGroup
                value={deliveryDateId ?? ''}
                onValueChange={selectDeliveryDate}
                aria-label="انتخاب روز تحویل"
                className="tw:grid tw:grid-cols-2 tw:gap-3 tw:sm:grid-cols-3"
              >
                {deliveryDates.map((date) => {
                  const selected = date.id === deliveryDateId;
                  return (
                    <Field
                      key={date.id}
                      className={cn(
                        'tw:rounded-2xl tw:border tw:p-3 tw:transition-colors tw:sm:p-4',
                        selected
                          ? 'tw:border-primary tw:bg-primary-muted/45'
                          : 'tw:border-border tw:bg-card',
                      )}
                    >
                      <FieldLabel
                        htmlFor={`delivery-date-${date.id}`}
                        className="tw:w-full tw:cursor-pointer tw:items-start tw:gap-3"
                      >
                        <RadioGroupItem
                          id={`delivery-date-${date.id}`}
                          value={date.id}
                          className="tw:mt-1"
                        />
                        <span className="tw:flex tw:min-w-0 tw:flex-1 tw:flex-col tw:gap-1">
                          <span className="tw:flex tw:flex-wrap tw:items-center tw:gap-1.5 tw:text-title-s">
                            {date.weekday}
                            {date.recommended ? (
                              <Badge size="xs" variant="tonal" color="success">
                                پیشنهادی
                              </Badge>
                            ) : null}
                          </span>
                          <span className="tw:text-body-s tw:text-muted-foreground">
                            {date.date}
                          </span>
                        </span>
                      </FieldLabel>
                    </Field>
                  );
                })}
              </RadioGroup>
            </div>

            <Separator />

            <div className="tw:flex tw:flex-col tw:gap-3">
              <p className="tw:text-label-l tw:text-card-foreground">بازه زمانی</p>
              <RadioGroup
                value={timeSlotId ?? ''}
                onValueChange={selectDeliveryTimeSlot}
                aria-label="انتخاب بازه زمانی تحویل"
                className="tw:grid tw:grid-cols-3 tw:gap-2 tw:sm:gap-3"
              >
                {deliveryTimeSlots.map((slot) => {
                  const selected = slot.id === timeSlotId;
                  return (
                    <Field
                      key={slot.id}
                      className={cn(
                        'tw:rounded-2xl tw:border tw:p-3 tw:transition-colors tw:sm:p-4',
                        selected
                          ? 'tw:border-primary tw:bg-primary-muted/45'
                          : 'tw:border-border tw:bg-card',
                      )}
                    >
                      <FieldLabel
                        htmlFor={`delivery-time-${slot.id}`}
                        className="tw:w-full tw:cursor-pointer tw:flex-col tw:items-center tw:gap-1 tw:text-center"
                      >
                        <RadioGroupItem
                          id={`delivery-time-${slot.id}`}
                          value={slot.id}
                          className="tw:mb-1"
                        />
                        <span className="tw:text-title-s">{slot.label}</span>
                        <span className="tw:text-label-s tw:text-muted-foreground">
                          {slot.description}
                        </span>
                      </FieldLabel>
                    </Field>
                  );
                })}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      </div>

      <CheckoutOrderSummary
        items={items}
        selectedDate={selectedDate}
        selectedTimeSlot={selectedTimeSlot}
        shippingPrice={shippingPrice}
        totals={totals}
      />
    </div>
  );
}
