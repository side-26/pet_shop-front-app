'use client';

import { MapPin } from 'lucide-react';
import { type ReactNode, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { useCheckoutStore } from '@/stores/checkout.store';

import {
  CheckoutAddressNavigationDrawerWrapper,
  type CheckoutAddressNavigationDrawerHandle,
} from './address-navigation-drawer-wrapper';
import { CheckoutSelectedAddressCard } from './address-radio-card';

export function CheckoutAddressSelectionRenderer({
  drawerList,
}: Readonly<{ drawerList: ReactNode }>) {
  const selectedAddress = useCheckoutStore((state) => state.selectedAddress);
  const drawerRef = useRef<CheckoutAddressNavigationDrawerHandle>(null);

  function openDrawer() {
    drawerRef.current?.open();
  }

  return (
    <section>
      <Card variant="elevated" size="md">
        <CardHeader>
          <CardTitle className="tw:flex tw:items-center tw:gap-2">
            <MapPin aria-hidden="true" className="tw:size-5 tw:text-primary" />
            نشانی تحویل
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedAddress === null ? (
            <Empty className="tw:border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MapPin aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>نشانی تحویل انتخاب نشده است</EmptyTitle>
                <EmptyDescription>
                  برای ادامه سفارش، نشانی تحویل موردنظر خود را انتخاب کنید.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button type="button" variant="outlined" onClick={openDrawer}>
                  انتخاب نشانی تحویل
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            <div className="tw:flex tw:flex-col tw:gap-3">
              <CheckoutSelectedAddressCard address={selectedAddress} />
              <Button type="button" variant="text" block onClick={openDrawer}>
                ویرایش نشانی تحویل
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <CheckoutAddressNavigationDrawerWrapper ref={drawerRef}>
        {drawerList}
      </CheckoutAddressNavigationDrawerWrapper>
    </section>
  );
}
