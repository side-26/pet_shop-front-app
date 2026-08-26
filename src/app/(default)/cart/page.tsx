import type { Metadata } from 'next';

import { CartPageContent } from './_components/cart-page-content';

export const metadata: Metadata = {
  title: 'سبد خرید | پناهگاه پرشین',
  description: 'مشاهده کالاها، تخفیف‌ها و مبلغ نهایی سبد خرید.',
};

export default function CartPage() {
  return <CartPageContent />;
}
