'use client';

import { RefreshCw, TriangleAlert, type LucideIcon } from 'lucide-react';
import { useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type PageErrorStateProps = Readonly<{
  className?: string;
  errorMessage?: string | null;
  icon?: LucideIcon;
  onRetry: () => void;
  statusCode: 400 | 500;
  title?: string;
}>;

export function PageErrorState({
  className,
  errorMessage,
  icon: Icon = TriangleAlert,
  onRetry,
  statusCode,
  title = statusCode === 400 ? 'درخواست قابل انجام نیست' : 'خطایی در سرور رخ داد',
}: PageErrorStateProps) {
  const [isRetrying, startRetryTransition] = useTransition();

  return (
    <main
      className={cn(
        'tw:default-layout-container tw:flex tw:min-h-[65svh] tw:items-center tw:py-10',
        className,
      )}
    >
      <Card
        size="lg"
        variant="glass"
        className="tw:mx-auto tw:w-full tw:max-w-xl tw:text-center"
        role="alert"
      >
        <CardHeader className="tw:items-center tw:gap-4">
          <span
            className="tw:grid tw:size-14 tw:place-items-center tw:rounded-2xl tw:bg-error-muted tw:text-error-muted-foreground"
            aria-hidden="true"
          >
            <Icon />
          </span>
          <span className="tw:text-title-s tw:text-error" dir="ltr">
            {statusCode}
          </span>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {errorMessage?.trim() || 'دریافت اطلاعات با مشکل روبه‌رو شد. لطفاً دوباره تلاش کنید.'}
          </CardDescription>
          <Button
            type="button"
            isLoading={isRetrying}
            loadingText="در حال تلاش دوباره..."
            onClick={() => startRetryTransition(onRetry)}
          >
            <RefreshCw data-icon="inline-start" aria-hidden="true" />
            تلاش دوباره
          </Button>
        </CardHeader>
      </Card>
    </main>
  );
}

export type { PageErrorStateProps };
