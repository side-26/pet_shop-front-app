import { Suspense } from 'react';

import { getProfileAddressesAction } from '@/entities/profile/profile.actions';

import { CheckoutAddressDrawerList } from './checkout-address-drawer-list';
import { CheckoutAddressDrawerListSkeleton } from './checkout-address-drawer-list-renderer';
import { CheckoutAddressSelectionRenderer } from './address-selection-renderer';
import { checkoutAddressSelectionSkeletonData } from './address-selection-skeleton-data';
import { DesktopAddressSelectionContainer } from './desktop-address-selection-container';
import { DesktopAddressSelectionRenderer } from './desktop-address-selection-renderer';

export function CheckoutAddressSelection() {
  const addressesPromise = getProfileAddressesAction();

  return (
    <>
      <div className="tw:lg:hidden">
        <CheckoutAddressSelectionRenderer
          drawerList={
            <Suspense fallback={<CheckoutAddressDrawerListSkeleton />}>
              <CheckoutAddressDrawerList />
            </Suspense>
          }
        />
      </div>
      <div className="tw:hidden tw:lg:block">
        <Suspense
          fallback={
            <DesktopAddressSelectionRenderer
              addresses={checkoutAddressSelectionSkeletonData}
              isSkeleton
            />
          }
        >
          <DesktopAddressSelectionContainer addressesPromise={addressesPromise} />
        </Suspense>
      </div>
    </>
  );
}
