import type { Metadata } from 'next';

import { PaymentResultSection } from '../_components/payment-result-section';

export const metadata: Metadata = {
  title: 'نتیجه پرداخت | پت شاپ پرشین',
  description: 'نمایش نتیجه پرداخت سفارش و انتقال خودکار به بخش مناسب.',
};

export default async function PaymentResultPage({
  params,
}: Readonly<{ params: Promise<{ authority: string }> }>) {
  const { authority } = await params;

  return <PaymentResultSection authority={authority} />;
}
