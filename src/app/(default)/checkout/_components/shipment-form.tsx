'use client';

import {
  CalendarDays,
  ChevronRight,
  Clock3,
  MapPin,
  PackageCheck,
  Pencil,
  Plus,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field } from '@/components/ui/field/default';
import { FieldLabel } from '@/components/ui/field/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/fields/radio-group';
import { Price } from '@/components/ui/price';
import { Separator } from '@/components/ui/separator';
import { routePaths } from '@/configs/route.path';
import { cn } from '@/lib/utils';

import type {
  CheckoutAddress,
  DeliveryDate,
  DeliveryMethod,
  DeliveryTimeSlot,
} from './checkout-data';

type ShipmentFormProps = Readonly<{
  addresses: readonly CheckoutAddress[];
  deliveryDates: readonly DeliveryDate[];
  deliveryMethods: readonly DeliveryMethod[];
  deliveryTimeSlots: readonly DeliveryTimeSlot[];
  items: readonly Readonly<{ id: string; title: string; image: string; quantity: number }>[];
  totals: Readonly<{ merchandise: number; discount: number; payable: number }>;
}>;

export function ShipmentForm({
  addresses,
  deliveryDates,
  deliveryMethods,
  deliveryTimeSlots,
  items,
  totals,
}: ShipmentFormProps) {
  const [addressId, setAddressId] = useState(addresses[0]?.id);
  const [deliveryId, setDeliveryId] = useState(deliveryMethods[0]?.id);
  const initialAvailableDates = deliveryDates.filter((date) =>
    date.methodIds.includes(deliveryMethods[0]?.id ?? ''),
  );
  const [deliveryDateId, setDeliveryDateId] = useState(initialAvailableDates[0]?.id);
  const [timeSlotId, setTimeSlotId] = useState(deliveryTimeSlots[0]?.id);
  const selectedDelivery = useMemo(
    () => deliveryMethods.find((method) => method.id === deliveryId) ?? deliveryMethods[0],
    [deliveryId, deliveryMethods],
  );
  const availableDates = useMemo(
    () => deliveryDates.filter((date) => date.methodIds.includes(deliveryId ?? '')),
    [deliveryDates, deliveryId],
  );
  const selectedDate = availableDates.find((date) => date.id === deliveryDateId);
  const selectedTimeSlot = deliveryTimeSlots.find((slot) => slot.id === timeSlotId);
  const shippingPrice = selectedDelivery?.price ?? 0;

  function selectDeliveryMethod(nextDeliveryId: string) {
    const nextAvailableDates = deliveryDates.filter((date) =>
      date.methodIds.includes(nextDeliveryId),
    );
    setDeliveryId(nextDeliveryId);
    setDeliveryDateId(nextAvailableDates[0]?.id);
  }

  return (
    <div className="tw:grid tw:items-start tw:gap-6 tw:lg:grid-cols-[minmax(0,1fr)_22rem] tw:xl:gap-8">
      <div className="tw:flex tw:min-w-0 tw:flex-col tw:gap-6">
        <Card variant="elevated" size="md">
          <CardHeader>
            <CardTitle className="tw:flex tw:items-center tw:gap-2">
              <MapPin aria-hidden="true" className="tw:size-5 tw:text-primary" />
              نشانی تحویل
            </CardTitle>
            <CardAction>
              <Button type="button" size="sm" variant="flat">
                <Plus data-icon="inline-start" aria-hidden="true" />
                افزودن نشانی
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={addressId}
              onValueChange={setAddressId}
              aria-label="انتخاب نشانی تحویل"
              className="tw:grid tw:gap-3 tw:md:grid-cols-2"
            >
              {addresses.map((address) => {
                const selected = address.id === addressId;
                return (
                  <Field
                    key={address.id}
                    className={cn(
                      'tw:relative tw:rounded-2xl tw:border tw:p-4 tw:transition-colors',
                      selected
                        ? 'tw:border-primary tw:bg-primary-muted/45'
                        : 'tw:border-border tw:bg-card',
                    )}
                  >
                    <FieldLabel
                      htmlFor={`address-${address.id}`}
                      className="tw:w-full tw:cursor-pointer tw:items-start tw:gap-3"
                    >
                      <RadioGroupItem
                        id={`address-${address.id}`}
                        value={address.id}
                        className="tw:mt-1"
                      />
                      <span className="tw:flex tw:min-w-0 tw:flex-1 tw:flex-col tw:gap-2">
                        <span className="tw:flex tw:flex-wrap tw:items-center tw:gap-2 tw:text-title-s">
                          {address.title}
                          {address.isDefault ? (
                            <Badge size="sm" variant="tonal" color="success">
                              نشانی پیش‌فرض
                            </Badge>
                          ) : null}
                        </span>
                        <span className="tw:text-body-s tw:leading-6 tw:text-muted-foreground">
                          {address.address}
                        </span>
                        <span className="tw:flex tw:flex-wrap tw:gap-x-4 tw:gap-y-1 tw:text-label-s tw:text-muted-foreground">
                          <span>{address.recipient}</span>
                          <bdi dir="ltr">{address.phone}</bdi>
                          <span>
                            کدپستی: <bdi>{address.postalCode}</bdi>
                          </span>
                        </span>
                      </span>
                    </FieldLabel>
                    <Button
                      type="button"
                      iconOnly
                      size="xs"
                      variant="flat"
                      aria-label={`ویرایش نشانی ${address.title}`}
                      className="tw:absolute tw:end-3 tw:bottom-3"
                    >
                      <Pencil aria-hidden="true" />
                    </Button>
                  </Field>
                );
              })}
            </RadioGroup>
          </CardContent>
        </Card>

        <Card variant="elevated" size="md">
          <CardHeader>
            <CardTitle className="tw:flex tw:items-center tw:gap-2">
              <Truck aria-hidden="true" className="tw:size-5 tw:text-primary" />
              روش ارسال
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={deliveryId}
              onValueChange={selectDeliveryMethod}
              aria-label="انتخاب روش ارسال"
              className="tw:grid tw:gap-3 tw:sm:grid-cols-2"
            >
              {deliveryMethods.map((method) => {
                const selected = method.id === deliveryId;
                return (
                  <Field
                    key={method.id}
                    className={cn(
                      'tw:rounded-2xl tw:border tw:p-4 tw:transition-colors',
                      selected
                        ? 'tw:border-primary tw:bg-primary-muted/45'
                        : 'tw:border-border tw:bg-card',
                    )}
                  >
                    <FieldLabel
                      htmlFor={`delivery-${method.id}`}
                      className="tw:w-full tw:cursor-pointer tw:items-start tw:gap-3"
                    >
                      <RadioGroupItem
                        id={`delivery-${method.id}`}
                        value={method.id}
                        className="tw:mt-1"
                      />
                      <span className="tw:flex tw:flex-1 tw:flex-col tw:gap-1.5">
                        <span className="tw:flex tw:items-center tw:justify-between tw:gap-3 tw:text-title-s">
                          <span>{method.title}</span>
                          {method.price === 0 ? (
                            <span className="tw:text-success">رایگان</span>
                          ) : (
                            <Price
                              number={method.price}
                              prefix="تومان"
                              className="tw:text-primary"
                            />
                          )}
                        </span>
                        <span className="tw:text-body-s tw:text-muted-foreground">
                          {method.description}
                        </span>
                        <span className="tw:flex tw:items-center tw:gap-1.5 tw:text-label-s tw:text-primary">
                          <CalendarDays aria-hidden="true" className="tw:size-4" />
                          {method.arrival}
                        </span>
                      </span>
                    </FieldLabel>
                  </Field>
                );
              })}
            </RadioGroup>
            <div className="tw:mt-4 tw:flex tw:items-center tw:gap-2 tw:rounded-2xl tw:bg-muted tw:p-3 tw:text-body-s tw:text-muted-foreground">
              <Clock3 aria-hidden="true" className="tw:size-4 tw:text-primary" />
              بازه دقیق تحویل پس از ثبت سفارش با شما هماهنگ می‌شود.
            </div>
          </CardContent>
        </Card>

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
                value={deliveryDateId}
                onValueChange={setDeliveryDateId}
                aria-label="انتخاب روز تحویل"
                className="tw:grid tw:grid-cols-2 tw:gap-3 tw:sm:grid-cols-3"
              >
                {availableDates.map((date) => {
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
                value={timeSlotId}
                onValueChange={setTimeSlotId}
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

      <aside className="tw:flex tw:flex-col tw:gap-4 tw:lg:sticky tw:lg:top-24 tw:lg:self-start">
        <Card variant="glass" size="md">
          <CardHeader>
            <CardTitle className="tw:text-title-l">خلاصه سفارش</CardTitle>
          </CardHeader>
          <CardContent className="tw:flex tw:flex-col tw:gap-4">
            <ul className="tw:flex tw:flex-col tw:gap-3" aria-label="کالاهای سفارش">
              {items.map((item) => (
                <li key={item.id} className="tw:flex tw:items-center tw:gap-3">
                  <span className="tw:relative tw:size-12 tw:shrink-0 tw:overflow-hidden tw:rounded-xl tw:bg-muted">
                    <Image src={item.image} alt="" fill sizes="48px" className="tw:object-cover" />
                  </span>
                  <span className="tw:min-w-0 tw:flex-1 tw:truncate tw:text-body-s">
                    {item.title}
                  </span>
                  <Badge size="sm" variant="tonal" color="secondary">
                    {item.quantity.toLocaleString('fa-IR')} عدد
                  </Badge>
                </li>
              ))}
            </ul>
            <Separator />
            <div className="tw:flex tw:items-start tw:gap-2 tw:rounded-2xl tw:bg-muted tw:p-3">
              <CalendarDays
                aria-hidden="true"
                className="tw:mt-0.5 tw:size-4 tw:shrink-0 tw:text-primary"
              />
              <p className="tw:text-body-s tw:text-muted-foreground">
                تحویل {selectedDate?.weekday} {selectedDate?.date}، ساعت{' '}
                <bdi>{selectedTimeSlot?.label}</bdi>
              </p>
            </div>
            <Separator />
            <dl className="tw:flex tw:flex-col tw:gap-3">
              <div className="tw:flex tw:justify-between tw:gap-4">
                <dt className="tw:text-body-s tw:text-muted-foreground">قیمت کالاها</dt>
                <dd className="tw:text-label-m">
                  <Price number={totals.merchandise} prefix="تومان" />
                </dd>
              </div>
              <div className="tw:flex tw:justify-between tw:gap-4">
                <dt className="tw:text-body-s tw:text-muted-foreground">تخفیف کالاها</dt>
                <dd className="tw:text-label-m tw:text-error">
                  <Price number={totals.discount} prefix="تومان" />
                </dd>
              </div>
              <div className="tw:flex tw:justify-between tw:gap-4">
                <dt className="tw:text-body-s tw:text-muted-foreground">هزینه ارسال</dt>
                <dd
                  className={
                    shippingPrice === 0 ? 'tw:text-label-m tw:text-success' : 'tw:text-label-m'
                  }
                >
                  {shippingPrice === 0 ? 'رایگان' : <Price number={shippingPrice} prefix="تومان" />}
                </dd>
              </div>
            </dl>
            <Separator />
            <div className="tw:flex tw:items-center tw:justify-between tw:gap-4">
              <span className="tw:text-title-s">مبلغ قابل پرداخت</span>
              <Price
                number={totals.payable + shippingPrice}
                prefix="تومان"
                className="tw:text-price-m tw:text-primary"
              />
            </div>
          </CardContent>
          <CardFooter className="tw:flex-col tw:items-stretch">
            <Button block size="lg">
              ادامه و پرداخت
            </Button>
            <Button
              nativeButton={false}
              render={<Link href={routePaths.cart} />}
              block
              variant="text"
            >
              <ChevronRight data-icon="inline-start" aria-hidden="true" />
              بازگشت به سبد خرید
            </Button>
            <p className="tw:flex tw:items-center tw:justify-center tw:gap-1.5 tw:text-label-s tw:text-muted-foreground">
              <ShieldCheck aria-hidden="true" className="tw:size-4" />
              پرداخت امن و تضمین اصالت کالا
            </p>
          </CardFooter>
        </Card>
        <p className="tw:flex tw:items-center tw:justify-center tw:gap-2 tw:text-label-s tw:text-muted-foreground">
          <PackageCheck aria-hidden="true" className="tw:size-4 tw:text-primary" />
          تمام کالاها آماده ارسال هستند.
        </p>
      </aside>
    </div>
  );
}
