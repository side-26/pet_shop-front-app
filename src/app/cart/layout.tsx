import { CartRouteLayout } from './_components/cart-route-layout';

export default function CartLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <CartRouteLayout>{children}</CartRouteLayout>;
}
