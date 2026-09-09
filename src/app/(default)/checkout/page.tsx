import type { Metadata } from 'next';

import { CheckoutPageContent } from './_components/checkout-page-content';

export const metadata: Metadata = {
  title: 'ارسال و تحویل سفارش | پت شاپ پرشین',
  description: 'انتخاب نشانی و روش ارسال سفارش پت شاپ پرشین.',
};

export default function CheckoutPage() {
  return <CheckoutPageContent />;
}
