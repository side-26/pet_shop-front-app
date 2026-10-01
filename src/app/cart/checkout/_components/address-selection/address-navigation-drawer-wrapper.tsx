'use client';

import dynamic from 'next/dynamic';
import { forwardRef, type ReactNode, useImperativeHandle, useState } from 'react';

const AsyncCheckoutAddressNavigationDrawer = dynamic(
  () =>
    import('./address-navigation-drawer').then((module) => module.CheckoutAddressNavigationDrawer),

  { ssr: true },
);

export type CheckoutAddressNavigationDrawerHandle = Readonly<{
  open: () => void;
  close: () => void;
}>;

type Props = Readonly<{ children: ReactNode }>;

export const CheckoutAddressNavigationDrawerWrapper = forwardRef<
  CheckoutAddressNavigationDrawerHandle,
  Props
>(function CheckoutAddressNavigationDrawerWrapper({ children }, ref) {
  const [isMounted, setMounted] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      open: () => setMounted(true),
      close: () => setMounted(false),
    }),
    [],
  );

  return isMounted ? (
    <AsyncCheckoutAddressNavigationDrawer isMounted onMountChanged={setMounted}>
      {children}
    </AsyncCheckoutAddressNavigationDrawer>
  ) : null;
});
