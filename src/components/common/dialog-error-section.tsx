'use client';

import { AlertCircle, RefreshCw, type LucideIcon } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { cn } from '@/lib/utils';

export type DialogFetchErrorSectionProps = Readonly<{
  className?: string;
  title?: ReactNode;
  description?: ReactNode;
  icon?: LucideIcon;
  onRetry: () => void;
  retryCooldownMs?: number;
}>;

export function DialogFetchErrorSection({
  className,
  title = 'خطا در دریافت اطلاعات',
  description = 'دریافت اطلاعات با مشکل مواجه شد. لطفاً دوباره تلاش کنید.',
  icon: Icon = AlertCircle,
  onRetry,
  retryCooldownMs = 2_000,
}: DialogFetchErrorSectionProps) {
  const [isCoolingDown, setIsCoolingDown] = useState(false);

  useEffect(() => {
    if (!isCoolingDown) return;

    const timeout = window.setTimeout(() => setIsCoolingDown(false), retryCooldownMs);

    return () => window.clearTimeout(timeout);
  }, [isCoolingDown, retryCooldownMs]);

  function handleRetry() {
    if (isCoolingDown) return;

    setIsCoolingDown(true);
    onRetry();
  }

  return (
    <Empty role="alert" className={cn('tw:w-full tw:min-h-48 tw:gap-4 tw:py-6', className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon aria-hidden="true" />
        </EmptyMedia>

        <EmptyTitle>{title}</EmptyTitle>

        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>

      <Button type="button" size="sm" disabled={isCoolingDown} onClick={handleRetry}>
        <RefreshCw data-icon="inline-start" />
        دریافت دوباره اطلاعات
      </Button>
    </Empty>
  );
}
