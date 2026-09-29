'use client';

import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { RadioGroup } from '@/components/ui/fields/radio-group';
import { routePaths } from '@/configs/route.path';
import { cn } from '@/lib/utils';

import type { CheckoutAddressViewModel } from './address-selection.types';
import { CheckoutAddressCarouselItem } from './address-carousel-item';

type Props = Readonly<{
  addresses: readonly CheckoutAddressViewModel[];
  isSkeleton?: boolean;
}>;

function ProfileLinkButton({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Button
      nativeButton={false}
      render={<Link href={routePaths.profile} />}
      size="sm"
      variant="flat"
    >
      {children}
    </Button>
  );
}

export function CheckoutAddressSelectionRenderer({ addresses, isSkeleton = false }: Props) {
  const [addressId, setAddressId] = useState(addresses[0]?.id);

  return (
    <section
      aria-busy={isSkeleton || undefined}
      className={cn(isSkeleton && 'skeleton tw:pointer-events-none tw:select-none')}
    >
      <Card variant="elevated" size="md">
        <CardHeader>
          <CardTitle className="tw:flex tw:items-center tw:gap-2">
            <MapPin aria-hidden="true" className="tw:size-5 tw:text-primary" />
            نشانی تحویل
          </CardTitle>
          {!isSkeleton ? (
            <CardAction>
              <ProfileLinkButton>افزودن نشانی</ProfileLinkButton>
            </CardAction>
          ) : null}
        </CardHeader>
        <CardContent>
          {isSkeleton ? (
            <CheckoutAddressCarousel addresses={addresses} isSkeleton />
          ) : addresses.length === 0 ? (
            <Empty className="tw:border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MapPin aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>نشانی تحویلی ثبت نشده است</EmptyTitle>
                <EmptyDescription>
                  برای ادامه سفارش، یک نشانی تحویل در پروفایل خود ثبت کنید.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <ProfileLinkButton>افزودن نشانی</ProfileLinkButton>
              </EmptyContent>
            </Empty>
          ) : (
            <RadioGroup
              value={addressId}
              onValueChange={setAddressId}
              aria-label="انتخاب نشانی تحویل"
            >
              <CheckoutAddressCarousel addresses={addresses} selectedAddressId={addressId} />
            </RadioGroup>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function CheckoutAddressCarousel({
  addresses,
  selectedAddressId,
  isSkeleton = false,
}: Readonly<{
  addresses: readonly CheckoutAddressViewModel[];
  selectedAddressId?: string;
  isSkeleton?: boolean;
}>) {
  return (
    <Carousel aria-label="نشانی‌های تحویل" opts={{ align: 'start' }}>
      <CarouselContent className="tw:pb-1">
        {addresses.map((address) => (
          <CheckoutAddressCarouselItem
            key={address.id}
            address={address}
            isSelected={address.id === selectedAddressId}
            isSkeleton={isSkeleton}
          />
        ))}
      </CarouselContent>
      <CarouselPrevious className="tw:start-2" disabled={isSkeleton} />
      <CarouselNext className="tw:end-2" disabled={isSkeleton} />
    </Carousel>
  );
}
