'use client';

import { Field } from '@/components/ui/field/default';
import { FieldLabel } from '@/components/ui/field/label';
import { RadioGroupItem } from '@/components/ui/fields/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/fields/select';
import { fetchJalaliMonth } from '@/configs/contants';
import { cn } from '@/lib/utils';
import { useCheckoutStore } from '@/stores/checkout.store';

import { useDeliveryTimeDay } from './delivery-time-day-context';

export function DeliveryTimeDayItem() {
  const day = useDeliveryTimeDay();
  const selectedDate = useCheckoutStore((state) => state.checkoutInformation.deliveryDate);
  const selectedTime = useCheckoutStore((state) => state.checkoutInformation.deliveryTimeSlot);
  const save = useCheckoutStore((state) => state.saveCheckoutInformation);
  const selected = selectedDate?.id === day.date;
  const selectTime = (time: (typeof day.availableTimes)[number]) =>
    save({
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
  return (
    <Field
      className={cn(
        'tw:flex tw:w-fit tw:items-center tw:justify-center tw:rounded-xl tw:border tw:p-3',
        selected
          ? 'tw:border-primary/45 tw:bg-primary-muted/70 tw:shadow-lg tw:shadow-primary/10 tw:supports-backdrop-filter:backdrop-blur-xl'
          : 'tw:border-border tw:bg-card',
      )}
    >
      <div className="tw:flex tw:items-center tw:gap-3">
        <FieldLabel
          htmlFor={`delivery-day-${day.date}`}
          onClick={() => selectTime(day.availableTimes[0])}
          className="tw:min-w-0 tw:flex-1 tw:cursor-pointer tw:gap-2"
        >
          <RadioGroupItem id={`delivery-day-${day.date}`} value={day.date} />
          <span className="tw:text-label-m">
            {day.weekday_fa}، {day.day_ja} {fetchJalaliMonth(day.month_ja)}
          </span>
        </FieldLabel>
        {selected ? (
          <Select
            value={selectedTime?.id}
            onValueChange={(id) => {
              const time = day.availableTimes.find(
                (item) => `${day.date}-${item.start}-${item.end}` === id,
              );
              if (time) selectTime(time);
            }}
          >
            <SelectTrigger className="tw:w-32">
              <SelectValue>{selectedTime?.label}</SelectValue>
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
}
