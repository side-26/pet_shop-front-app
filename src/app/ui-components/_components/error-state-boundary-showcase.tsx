'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ErrorStateBoundary } from '@/components/ui/error-state-boundary';

import { ShowcaseSection } from './showcase-section';

function ErrorStateFallback() {
  return <p role="alert">نمایش جایگزینِ خطای بخش</p>;
}

function ErrorTrigger({ shouldThrow }: Readonly<{ shouldThrow: boolean }>) {
  if (shouldThrow) throw new Error('ErrorStateBoundary showcase error');

  return <p>محتوای بخش بدون خطا نمایش داده می‌شود.</p>;
}

export function ErrorStateBoundaryShowcase() {
  const [shouldThrow, setShouldThrow] = useState(false);

  return (
    <ShowcaseSection
      id="error-state-boundaries"
      title="Error State Boundary"
      description="نمایش children در حالت عادی و fallback هنگام خطای زمان رندر."
    >
      <div className="tw:flex tw:flex-col tw:items-start tw:gap-4">
        <ErrorStateBoundary key={String(shouldThrow)} fallback={<ErrorStateFallback />}>
          <ErrorTrigger shouldThrow={shouldThrow} />
        </ErrorStateBoundary>
        <Button type="button" onClick={() => setShouldThrow((current) => !current)}>
          {shouldThrow ? 'بازگرداندن محتوای سالم' : 'نمایش حالت خطا'}
        </Button>
      </div>
    </ShowcaseSection>
  );
}
