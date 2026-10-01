'use client';

import { MapPin, Phone, UserRound } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Field } from '@/components/ui/field/default';
import { FieldLabel } from '@/components/ui/field/label';
import { RadioGroupItem } from '@/components/ui/fields/radio-group';
import { cn } from '@/lib/utils';

import type { CheckoutAddressViewModel } from './address-selection.types';

type Props = Readonly<{
  address: CheckoutAddressViewModel;
  isSelected?: boolean;
  isSkeleton?: boolean;
}>;

export function CheckoutAddressRadioCard({
  address,
  isSelected = false,
  isSkeleton = false,
}: Props) {
  const inputId = `checkout-address-${address.id}`;

  return (
    <Field
      className={cn(
        'tw:h-full tw:rounded-2xl tw:border tw:transition-colors',
        isSelected ? 'tw:border-primary tw:bg-primary-muted/45' : 'tw:border-border',
      )}
    >
      <Card className="tw:h-full tw:border-0 tw:bg-transparent tw:shadow-none" size="sm">
        <CardContent className="tw:h-full">
          {isSkeleton ? (
            <div className="tw:flex tw:h-full tw:flex-col tw:gap-3" aria-hidden="true">
              <div className="tw:h-5 tw:w-2/3 tw:rounded tw:bg-muted" />
              <div className="tw:h-16 tw:rounded tw:bg-muted" />
              <div className="tw:h-4 tw:w-1/2 tw:rounded tw:bg-muted" />
            </div>
          ) : (
            <FieldLabel
              htmlFor={inputId}
              className="tw:h-full tw:w-full tw:cursor-pointer tw:items-start tw:gap-3"
            >
              <RadioGroupItem id={inputId} value={address.id} className="tw:mt-1" />
              <AddressDetails address={address} />
            </FieldLabel>
          )}
        </CardContent>
      </Card>
    </Field>
  );
}

export function CheckoutSelectedAddressCard({
  address,
}: Readonly<{ address: CheckoutAddressViewModel }>) {
  return (
    <Card size="sm" variant="outlined">
      <CardContent className="tw:flex tw:items-start tw:gap-3">
        <MapPin aria-hidden="true" className="tw:mt-1 tw:size-5 tw:shrink-0 tw:text-primary" />
        <AddressDetails address={address} />
      </CardContent>
    </Card>
  );
}

function AddressDetails({ address }: Readonly<{ address: CheckoutAddressViewModel }>) {
  return (
    <span className="tw:flex tw:min-w-0 tw:flex-1 tw:flex-col tw:gap-2">
      <span className="tw:text-title-s">{address.title}</span>
      <span className="tw:text-body-s tw:leading-6 tw:text-muted-foreground">
        {address.address}
      </span>
      <span className="tw:flex tw:flex-wrap tw:items-center tw:gap-x-4 tw:gap-y-1 tw:text-label-s tw:text-muted-foreground">
        <span className="tw:flex tw:items-center tw:gap-1.5">
          <UserRound aria-hidden="true" className="tw:size-3.5" />
          {address.recipient}
        </span>
        <span className="tw:flex tw:items-center tw:gap-1.5">
          <Phone aria-hidden="true" className="tw:size-3.5" />
          <bdi dir="ltr">{address.phone}</bdi>
        </span>
        <span className="tw:inline-flex tw:items-center">
          کد پستی: <bdi dir="ltr">{address.postalCode}</bdi>
        </span>
      </span>
    </span>
  );
}
