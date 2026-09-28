'use client';

import { useEffect } from 'react';

import { PageErrorState } from '@/components/common/page-error-state';
import { retryCartAction } from '@/entities/users/users.actions';

export default function CartError({
  error,
  retry,
}: Readonly<{ error: Error & { digest?: string }; retry: () => void }>) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
