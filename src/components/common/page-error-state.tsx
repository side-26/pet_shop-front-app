'use client';

import { CircleX, RefreshCw, ServerCrash, type LucideIcon } from 'lucide-react';
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
  statusCode,
  icon: Icon = statusCode === 400 ? CircleX : ServerCrash,
  onRetry,
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
