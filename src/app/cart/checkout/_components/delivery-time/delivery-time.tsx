'use client';

import { CalendarDays } from 'lucide-react';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup } from '@/components/ui/fields/radio-group';
import { useCheckoutStore } from '@/stores/checkout.store';
import { DeliveryTimeDayContext } from './delivery-time-day-context';
import { DeliveryTimeDayItem } from './delivery-time-day-item';
import { DeliveryTimeEmpty } from './delivery-time-empty';

export function DeliveryTime() {
  const availability =
    useCheckoutStore((state) => state.checkoutInformation.deliveryServiceAvailability) ?? [];
  const selectedDate = useCheckoutStore((state) => state.checkoutInformation.deliveryDate);
  const selectedTime = useCheckoutStore((state) => state.checkoutInformation.deliveryTimeSlot);
  const save = useCheckoutStore((state) => state.saveCheckoutInformation);
  useEffect(() => {
    const day = availability[0];
    const time = day?.availableTimes[0];
    if (!day || !time || selectedTime) return;
    save({
      deliveryDate: { id: day.date, weekday: `${day.weekday_fa}، ${day.day_ja}` },
      deliveryTimeSlot: {
        id: `${day.date}-${time.start}-${time.end}`,
        label: `${time.start} تا ${time.end}`,
        description: '',
        weekday: day.weekday,
        startsAt: String(time.start),
        endsAt: String(time.end),
      },
    });
  }, [availability, save, selectedTime]);
  return (
    <Card variant="elevated" size="md">
      <CardHeader>
        <CardTitle className="tw:flex tw:items-center tw:gap-2">
          <CalendarDays aria-hidden="true" className="tw:size-5 tw:text-primary" />
          زمان تحویل
        </CardTitle>
      </CardHeader>
      <CardContent>
        {availability.length === 0 ? (
          <DeliveryTimeEmpty />
        ) : (
          <RadioGroup
            value={selectedDate?.id ?? ''}
            aria-label="انتخاب روز تحویل"
            className="tw:flex tw:flex-wrap tw:gap-2"
          >
            {availability.map((day) => (
              <DeliveryTimeDayContext.Provider key={day.date} value={day}>
                <DeliveryTimeDayItem />
              </DeliveryTimeDayContext.Provider>
            ))}
          </RadioGroup>
        )}
      </CardContent>
    </Card>
  );
}
