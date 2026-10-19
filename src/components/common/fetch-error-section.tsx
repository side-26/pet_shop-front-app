'use client';

import { RefreshCw, RotateCcw, type LucideIcon } from 'lucide-react';
import { type ErrorInfo } from 'next/error';
import { useEffect, useState, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ErrorStateBoundary } from '@/components/ui/error-state-boundary';
import { cn } from '@/lib/utils';

type FetchErrorSectionProps = Readonly<{
  className?: string;
  description?: ReactNode;
  icon?: LucideIcon;
  onRetry: () => void;
  retryCooldownMs?: number;
  title?: ReactNode;
}>;

type FetchErrorDescription = ReactNode | ((error: unknown) => ReactNode);

type FetchErrorSectionBoundaryOptions<TProps extends object> = Readonly<
  Omit<FetchErrorSectionProps, 'description' | 'onRetry'> & {
    description?: FetchErrorDescription;
    onRetry?: (props: TProps, retry: ErrorInfo['retry']) => void;
  }
>;

/**
 * A recovery UI for a section whose server-side API request could not be completed.
 *
 * `onRetry` should retry only the affected data boundary (for example, Next.js
 * `retry` from an error boundary). The page reload action intentionally performs
 * a hard browser reload to recover from broader stale-client or route failures.
 */
function FetchErrorSection({
  className,
  description = 'دریافت اطلاعات این بخش با مشکل روبه‌رو شد. دوباره تلاش کنید.',
  icon: Icon = RefreshCw,
  onRetry,
  retryCooldownMs = 3_000,
  title = 'بارگذاری اطلاعات انجام نشد',
}: FetchErrorSectionProps) {
  const [isRetryCoolingDown, setIsRetryCoolingDown] = useState(false);

  useEffect(() => {
    if (!isRetryCoolingDown) return;

    const timeout = window.setTimeout(() => setIsRetryCoolingDown(false), retryCooldownMs);
    return () => window.clearTimeout(timeout);
  }, [isRetryCoolingDown, retryCooldownMs]);

  function handleRetry() {
    if (isRetryCoolingDown) return;

    setIsRetryCoolingDown(true);
    onRetry();
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
        <Button type="button" onClick={handleRetry} disabled={isRetryCoolingDown}>
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

/**
 * Creates a section-level error boundary with the shared recovery UI and
 * centralized browser-error reporting. It delegates boundary behavior to the
 * application-wide ErrorStateBoundary; feature files provide only their copy
 * and, when needed, the extra retry work for that data region.
 */
function createFetchErrorSectionBoundary<TProps extends object = Record<never, never>>(
  options: FetchErrorSectionBoundaryOptions<TProps>,
) {
  return function FetchErrorSectionBoundary({
    children,
    ...props
  }: Readonly<TProps & { children: ReactNode }>) {
    return (
      <ErrorStateBoundary
        fallbackRender={({ error, retry }) => {
          const description =
            typeof options.description === 'function'
              ? options.description(error)
              : options.description;

          return (
            <FetchErrorSection
              {...options}
              description={description}
              onRetry={() => options.onRetry?.(props as TProps, retry) ?? retry()}
            />
          );
        }}
      >
        {children}
      </ErrorStateBoundary>
    );
  };
}

export {
  FetchErrorSection,
  createFetchErrorSectionBoundary,
  type FetchErrorSectionBoundaryOptions,
  type FetchErrorSectionProps,
};
