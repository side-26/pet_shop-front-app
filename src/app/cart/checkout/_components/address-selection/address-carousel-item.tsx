'use client';

import { CarouselItem } from '@/components/ui/carousel';

import type { CheckoutAddressViewModel } from './address-selection.types';
import { CheckoutAddressRadioCard } from './address-radio-card';

type Props = Readonly<{
  address: CheckoutAddressViewModel;
  isSelected: boolean;
  isSkeleton?: boolean;
}>;

export function CheckoutAddressCarouselItem({ address, isSelected, isSkeleton = false }: Props) {
  return (
    <CarouselItem className="tw:basis-1/2">
      <CheckoutAddressRadioCard address={address} isSelected={isSelected} isSkeleton={isSkeleton} />
    </CarouselItem>
  );
}
