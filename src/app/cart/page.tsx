import type { Metadata } from 'next';

import { CartPageSection } from './_components/cart-page-section';

export const metadata: Metadata = {
  title: 'سبد خرید | پت شاپ پرشین',
  description: 'مشاهده کالاها، تخفیف‌ها و مبلغ نهایی سبد خرید.',
};

export default function CartPage() {
  return <CartPageSection />;
}
