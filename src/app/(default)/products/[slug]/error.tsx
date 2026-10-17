'use client';

import { PageErrorState } from '@/components/common/page-error-state';
import { useReportClientError } from '@/hooks/use-report-client-error';

export default function ProductDetailError({
  error,
  retry,
}: Readonly<{ error: Error & { digest?: string }; retry: () => void }>) {
  useReportClientError(error);

  return (
    <PageErrorState statusCode={500} errorMessage="بارگذاری محصول کامل نشد." onRetry={retry} />
  );
}
