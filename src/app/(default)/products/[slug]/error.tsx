'use client';

import { useEffect } from 'react';

import { PageErrorState } from '@/components/common/page-error-state';

export default function ProductDetailError({
  error,
  retry,
}: Readonly<{ error: Error & { digest?: string }; retry: () => void }>) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageErrorState statusCode={500} errorMessage="بارگذاری محصول کامل نشد." onRetry={retry} />
  );
}
