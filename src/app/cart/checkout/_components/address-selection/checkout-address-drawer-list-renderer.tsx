'use client';

import { MapPin } from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { RadioGroup } from '@/components/ui/fields/radio-group';

import { CheckoutAddressRadioCard } from './address-radio-card';
import { checkoutAddressSelectionSkeletonData } from './address-selection-skeleton-data';
import type { CheckoutAddressViewModel } from './address-selection.types';

export function CheckoutAddressDrawerListRenderer({
  addresses = checkoutAddressSelectionSkeletonData,
  selectedAddressId,
  onValueChange,
  isSkeleton = false,
}: Readonly<{
  addresses?: readonly CheckoutAddressViewModel[];
  selectedAddressId?: string;
  onValueChange?: (addressId: string) => void;
  isSkeleton?: boolean;
}>) {
  if (isSkeleton) {
    return (
      <section aria-busy="true" className="skeleton tw:pointer-events-none tw:select-none">
        <div className="tw:flex tw:flex-col tw:gap-3" aria-hidden="true">
          {addresses.map((address) => (
            <CheckoutAddressRadioCard key={address.id} address={address} isSkeleton />
          ))}
        </div>
      </section>
    );
  }

  if (addresses.length === 0) {
    return (
      <Empty className="tw:border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MapPin aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>نشانی تحویلی ثبت نشده است</EmptyTitle>
          <EmptyDescription>
            برای ادامه سفارش، ابتدا یک نشانی در پروفایل خود ثبت کنید.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <RadioGroup
      value={selectedAddressId ?? ''}
      onValueChange={onValueChange}
      aria-label="انتخاب نشانی تحویل"
      className="tw:flex tw:flex-col tw:gap-3"
    >
      {addresses.map((address) => (
        <CheckoutAddressRadioCard
          key={address.id}
          address={address}
          isSelected={address.id === selectedAddressId}
        />
      ))}
    </RadioGroup>
  );
}

export function CheckoutAddressDrawerListSkeleton() {
  return <CheckoutAddressDrawerListRenderer isSkeleton />;
}
