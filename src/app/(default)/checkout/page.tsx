import type { Metadata } from 'next';

import { CheckoutPageContent } from './_components/checkout-page-content';

export const metadata: Metadata = {
  title: 'ارسال و تحویل سفارش | پناهگاه پرشین',
  description: 'انتخاب نشانی و روش ارسال سفارش فروشگاه پناهگاه پرشین.',
};

export default function CheckoutPage() {
  return <CheckoutPageContent />;
}
