'use client';

import { catchError, type ErrorInfo } from 'next/error';
import type { ReactNode } from 'react';

import { useReportClientError } from '@/lib/logging/use-report-client-error';

type ErrorStateBoundaryProps = Readonly<{
  children: ReactNode;
  fallback?: ReactNode;
  fallbackRender?: (info: ErrorInfo) => ReactNode;
}>;

function ErrorStateFallback(
  { fallback, fallbackRender }: Omit<ErrorStateBoundaryProps, 'children'>,
  info: ErrorInfo,
) {
  useReportClientError(info.error);

  if (fallbackRender) {
    return fallbackRender(info);
  }

  return fallback ?? null;
}

const ErrorStateBoundary = catchError(ErrorStateFallback);

export { ErrorStateBoundary, type ErrorStateBoundaryProps };
