import { ConfirmDialog } from '@/components/common/confirm-dialog/main';

import { CartRouteHeader } from './cart-route-header';

type CartRouteLayoutProps = Readonly<{ children: React.ReactNode }>;

export function CartRouteLayout({ children }: CartRouteLayoutProps) {
  return (
    <div data-cart-route-layout className="tw:flex tw:min-h-svh tw:flex-col tw:bg-background">
      <CartRouteHeader />
      <div className="tw:min-h-0 tw:flex-1">{children}</div>
      <ConfirmDialog />
    </div>
  );
}
