import Image from 'next/image';
import { Suspense } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Price } from '@/components/ui/price';
import { getGatewayPaymentAction } from '@/entities/payments/payments.actions';
import type { GatewayPaymentDTO } from '@/entities/payments/payments.dto';

import failedIllustration from '../../../../../public/images/payment-result/payment-failed-image-light.png';
import successIllustration from '../../../../../public/images/payment-result/payment-success-illustration.svg';

import { PaymentResultClientActions } from './payment-result-client-actions';

type GatewayPaymentRequest = ReturnType<typeof getGatewayPaymentAction>;
type PaymentResultViewModel = Readonly<{
  isSuccess: boolean;
  title: string;
  subtitle: string;
  amount?: number;
  companyName?: string;
  illustration: typeof successIllustration | typeof failedIllustration;
  illustrationAlt: string;
}>;

export function toPaymentResultViewModel(
  result: Awaited<GatewayPaymentRequest>,
): PaymentResultViewModel {
  const payment = result?.isSuccess ? (result.data as GatewayPaymentDTO) : null;
  const isSuccess = payment?.status === 'paid';

  if (isSuccess) {
    return {
      isSuccess: true,
      title: 'پرداخت شما با موفقیت انجام شد',
      subtitle: 'سفارش شما ثبت شد و به‌زودی برای آماده‌سازی آن اقدام می‌کنیم.',
      amount: payment.finalPrice,
      companyName: payment.companyName,
      illustration: successIllustration,
      illustrationAlt: 'تصویر موفقیت پرداخت',
    };
  }

  return {
    isSuccess: false,
    title: 'پرداخت ناموفق بود',
    subtitle: result?.isSuccess
      ? 'پرداخت تأیید نشد. می‌توانید دوباره برای پرداخت سفارش اقدام کنید.'
      : (result?.message ?? 'نتیجه پرداخت قابل دریافت نیست. لطفاً دوباره تلاش کنید.'),
    illustration: failedIllustration,
    illustrationAlt: 'تصویر ناموفق بودن پرداخت',
  };
}

function PaymentResultRenderer({
  viewModel,
  isSkeleton = false,
}: Readonly<{ viewModel: PaymentResultViewModel; isSkeleton?: boolean }>) {
  return (
    <main
      aria-busy={isSkeleton || undefined}
      className="tw:flex tw:min-h-dvh tw:items-center tw:justify-center tw:px-4 tw:py-8 tw:sm:px-6 tw:lg:px-8"
    >
      <Card
        variant="elevated"
        size="lg"
        className={`tw:w-full tw:max-w-xl ${isSkeleton ? 'skeleton tw:pointer-events-none' : ''}`}
      >
        <CardContent className="tw:flex tw:flex-col tw:items-center tw:gap-6 tw:text-center tw:sm:gap-8">
          <Image
            src={viewModel.illustration}
            alt={isSkeleton ? '' : viewModel.illustrationAlt}
            priority={!isSkeleton}
            className="tw:h-auto tw:w-44 tw:sm:w-52"
          />
          <div className="tw:flex tw:flex-col tw:items-center tw:gap-3">
            <h1 className="tw:text-heading-2 tw:text-foreground">{viewModel.title}</h1>
            <p className="tw:max-w-md tw:text-body-m tw:text-muted-foreground">
              {viewModel.subtitle}
            </p>
            {viewModel.amount !== undefined ? (
              <p className="tw:text-title-m tw:text-success">
                مبلغ پرداخت‌شده: <Price number={viewModel.amount} />
              </p>
            ) : null}
            {viewModel.companyName ? (
              <p className="tw:text-body-s tw:text-muted-foreground">
                درگاه: {viewModel.companyName}
              </p>
            ) : null}
          </div>
          {!isSkeleton ? <PaymentResultClientActions isSuccess={viewModel.isSuccess} /> : null}
        </CardContent>
      </Card>
    </main>
  );
}

async function PaymentResultContainer({ request }: Readonly<{ request: GatewayPaymentRequest }>) {
  return <PaymentResultRenderer viewModel={toPaymentResultViewModel(await request)} />;
}

const paymentResultSkeleton: PaymentResultViewModel = {
  isSuccess: false,
  title: 'در حال بررسی نتیجه پرداخت',
  subtitle: 'لطفاً چند لحظه صبر کنید.',
  illustration: successIllustration,
  illustrationAlt: '',
};

export function PaymentResultSection({ authority }: Readonly<{ authority: string }>) {
  const request = getGatewayPaymentAction({ authority });

  return (
    <Suspense fallback={<PaymentResultRenderer viewModel={paymentResultSkeleton} isSkeleton />}>
      <PaymentResultContainer request={request} />
    </Suspense>
  );
}
