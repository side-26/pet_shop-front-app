'use client';

import { RefreshCw, RotateCcw, type LucideIcon } from 'lucide-react';
import { useEffect, useState, useTransition, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

type FetchErrorSectionBoundaryProps = Readonly<{
  className?: string;
  description?: ReactNode;
  icon?: LucideIcon;
  onRetry: () => void;
  retryCooldownMs?: number;
  title?: ReactNode;
}>;

/**
 * A recovery UI for a section whose server-side API request could not be completed.
 *
 * `onRetry` should retry only the affected data boundary (for example, Next.js
 * `retry` from an error boundary). The page reload action intentionally performs
 * a hard browser reload to recover from broader stale-client or route failures.
 */
function FetchErrorSectionBoundary({
  className,
  description = 'دریافت اطلاعات این بخش با مشکل روبه‌رو شد. دوباره تلاش کنید.',
  icon: Icon = RefreshCw,
  onRetry,
  retryCooldownMs = 3_000,
  title = 'بارگذاری اطلاعات انجام نشد',
}: FetchErrorSectionBoundaryProps) {
  const [isRetrying, startRetryTransition] = useTransition();
  const [isRetryCoolingDown, setIsRetryCoolingDown] = useState(false);

  useEffect(() => {
    if (!isRetryCoolingDown) return;

    const timeout = window.setTimeout(() => setIsRetryCoolingDown(false), retryCooldownMs);
    return () => window.clearTimeout(timeout);
  }, [isRetryCoolingDown, retryCooldownMs]);

  function handleRetry() {
    if (isRetryCoolingDown) return;

    setIsRetryCoolingDown(true);
    startRetryTransition(onRetry);
  }

  function handlePageReload() {
    window.location.reload();
  }

  return (
    <Card
      className={cn('tw:mx-auto tw:w-full tw:max-w-xl tw:text-center', className)}
      variant="glass"
      size="lg"
      role="alert"
    >
      <CardHeader className="tw:justify-items-center">
        <span
          aria-hidden="true"
          className="tw:flex tw:size-12 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-error-muted tw:text-error-muted-foreground"
        >
          <Icon />
        </span>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="tw:sr-only">
        برای بازیابی، دوباره تلاش کنید یا صفحه را بازنشانی کنید.
      </CardContent>

      <CardFooter className="tw:justify-center">
        <Button
          type="button"
          disabled={isRetryCoolingDown}
          isLoading={isRetrying}
          loadingText="در حال دریافت اطلاعات..."
          onClick={handleRetry}
        >
          <RefreshCw data-icon="inline-start" />
          دریافت دوباره اطلاعات
        </Button>
        <Button type="button" color="error" variant="outlined" onClick={handlePageReload}>
          <RotateCcw data-icon="inline-start" />
          بارگذاری مجدد صفحه
        </Button>
      </CardFooter>
    </Card>
  );
}

export { FetchErrorSectionBoundary, type FetchErrorSectionBoundaryProps };
