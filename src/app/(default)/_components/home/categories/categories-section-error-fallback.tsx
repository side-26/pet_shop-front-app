'use client';

import { FetchErrorSection } from '@/components/common/fetch-error-section';

const fallbackDescription = 'دریافت دسته‌بندی‌های حیوانات با مشکل روبه‌رو شد. دوباره تلاش کنید.';

function getErrorDescription(error: unknown) {
  return error instanceof Error && error.message.trim() ? error.message : fallbackDescription;
}

type CategoriesSectionErrorFallbackProps = Readonly<{
  error: unknown;
  onRetry: () => void;
}>;

export function CategoriesSectionErrorFallback({
  error,
  onRetry,
}: CategoriesSectionErrorFallbackProps) {
  return (
    <FetchErrorSection
      description={getErrorDescription(error)}
      onRetry={onRetry}
      title="دریافت دسته‌بندی حیوانات انجام نشد"
    />
  );
}
