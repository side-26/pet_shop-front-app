'use client';

import { PageErrorState } from '@/components/common/page-error-state';
import { retryCartAction } from '@/entities/users/users.actions';
import { useReportClientError } from '@/hooks/use-report-client-error';

export default function CartError({
  error,
  retry,
}: Readonly<{ error: Error & { digest?: string }; retry: () => void }>) {
  useReportClientError(error);

  async function handleRetry() {
    await retryCartAction();
    retry();
  }

  return (
    <PageErrorState
      statusCode={500}
      title="بارگذاری سبد خرید انجام نشد"
      errorMessage={error.message}
      onRetry={handleRetry}
    />
  );
}
