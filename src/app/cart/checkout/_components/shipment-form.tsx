'use client';

import { CalendarDays } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field/default';
import { FieldLabel } from '@/components/ui/field/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/fields/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/fields/select';
import { fetchJalaliMonth } from '@/configs/contants';
import { cn } from '@/lib/utils';
import { type CheckoutDeliveryAvailability, useCheckoutStore } from '@/stores/checkout.store';

import type { DeliveryDate, DeliveryTimeSlot } from './checkout-data';
import { CheckoutOrderSummary } from './checkout-order-summary';
import { DeliveryTime } from './delivery-time/delivery-time';

const EMPTY_DELIVERY_AVAILABILITY: readonly CheckoutDeliveryAvailability[] = [];

type ShipmentFormProps = Readonly<{
  addressSelection: ReactNode;
  deliveryServicesSelection: ReactNode;
  deliveryDates: readonly DeliveryDate[];
  deliveryTimeSlots: readonly DeliveryTimeSlot[];
  totals: Readonly<{ merchandise: number; discount: number; payable: number }>;
}>;

export function ShipmentForm({
  addressSelection,
  deliveryServicesSelection,
  deliveryDates: _deliveryDates,
  deliveryTimeSlots: _deliveryTimeSlots,
  totals,
}: ShipmentFormProps) {
  const selectedDate = useCheckoutStore((state) => state.checkoutInformation.deliveryDate);
  const selectedTimeSlot = useCheckoutStore((state) => state.checkoutInformation.deliveryTimeSlot);
  const availability =
    useCheckoutStore((state) => state.checkoutInformation.deliveryServiceAvailability) ??
    EMPTY_DELIVERY_AVAILABILITY;
  const saveCheckoutInformation = useCheckoutStore((state) => state.saveCheckoutInformation);
  const timeSlotId = selectedTimeSlot?.id;
  const shippingPrice = 0;

  useEffect(() => {
    const day = availability[0];
    const time = day?.availableTimes[0];
    if (!day || !time || selectedTimeSlot) return;
    saveCheckoutInformation({
      deliveryDate: {
        id: day.date,
        weekday: `${day.weekday_fa}، ${day.day_ja} ${fetchJalaliMonth(day.month_ja)}`,
      },
      deliveryTimeSlot: {
        id: `${day.date}-${time.start}-${time.end}`,
        label: `${time.start} تا ${time.end}`,
        description: '',
        weekday: day.weekday,
        startsAt: String(time.start),
        endsAt: String(time.end),
      },
    });
  }, [availability, selectedTimeSlot, saveCheckoutInformation]);

  function selectDeliveryTime(
    day: (typeof availability)[number],
    time: (typeof availability)[number]['availableTimes'][number],
  ) {
    const label = `${time.start} تا ${time.end}`;
    saveCheckoutInformation({
      deliveryDate: {
        id: day.date,
        weekday: `${day.weekday_fa}، ${day.day_ja} ${fetchJalaliMonth(day.month_ja)}`,
      },
      deliveryTimeSlot: {
        id: `${day.date}-${time.start}-${time.end}`,
        label,
        description: '',
        weekday: day.weekday,
        startsAt: String(time.start),
        endsAt: String(time.end),
      },
    });
  }

  return (
    <div className="tw:grid tw:items-start tw:gap-6 tw:lg:grid-cols-[minmax(0,1fr)_22rem] tw:xl:gap-8">
      <div className="tw:flex tw:min-w-0 tw:flex-col tw:gap-6">
        {addressSelection}
        {deliveryServicesSelection}
        <DeliveryTime />

        {false ? (
          <Card variant="elevated" size="md">
            <CardHeader>
              <CardTitle className="tw:flex tw:items-center tw:gap-2">
                <CalendarDays aria-hidden="true" className="tw:size-5 tw:text-primary" />
                زمان تحویل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedDate?.id ?? ''}
                aria-label="انتخاب روز تحویل"
                className="tw:flex tw:flex-wrap tw:gap-2"
              >
                {availability.map((day) => {
                  const selected = selectedDate?.id === day.date;
                  return (
                    <Field
                      key={day.date}
                      className={cn(
                        'tw:flex tw:w-fit tw:items-center tw:justify-center tw:rounded-xl tw:border tw:p-3 tw:transition-[background-color,border-color,box-shadow] tw:motion-reduce:transition-none',
                        selected
                          ? 'tw:border-primary/45 tw:bg-primary-muted/70 tw:shadow-lg tw:shadow-primary/10 tw:supports-backdrop-filter:backdrop-blur-xl'
                          : 'tw:border-border tw:bg-card',
                      )}
                    >
                      <div className="tw:flex tw:items-center tw:gap-3">
                        <FieldLabel
                          htmlFor={`delivery-day-${day.date}`}
                          onClick={() => selectDeliveryTime(day, day.availableTimes[0])}
                          className="tw:min-w-0 tw:flex-1 tw:cursor-pointer tw:gap-2"
                        >
                          <RadioGroupItem id={`delivery-day-${day.date}`} value={day.date} />
                          <span className="tw:text-title-s">
                            {day.weekday_fa}، {day.day_ja} {fetchJalaliMonth(day.month_ja)}
                          </span>
                        </FieldLabel>
                        {selectedDate?.id === day.date ? (
                          <Select
                            value={timeSlotId}
                            onValueChange={(id) => {
                              const time = day.availableTimes.find(
                                (item) => `${day.date}-${item.start}-${item.end}` === id,
                              );
                              if (time) selectDeliveryTime(day, time);
                            }}
                          >
                            <SelectTrigger className="tw:w-32">
                              <SelectValue>{selectedTimeSlot?.label}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {day.availableTimes.map((time) => {
                                const id = `${day.date}-${time.start}-${time.end}`;
                                return (
                                  <SelectItem key={id} value={id}>
                                    {time.start} تا {time.end}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        ) : null}
                      </div>
                    </Field>
                  );
                })}
              </RadioGroup>
            </CardContent>
          </Card>
        ) : null}
      </div>

      <CheckoutOrderSummary
        selectedDate={selectedDate}
        selectedTimeSlot={selectedTimeSlot}
        shippingPrice={shippingPrice}
        totals={totals}
      />
    </div>
  );
}

const weekdayNames: Record<string, string> = {
  saturday: 'شنبه',
  sunday: 'یکشنبه',
  monday: 'دوشنبه',
  tuesday: 'سه‌شنبه',
  wednesday: 'چهارشنبه',
  thursday: 'پنجشنبه',
  friday: 'جمعه',
};
