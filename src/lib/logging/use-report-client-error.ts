'use client';

import { useEffect } from 'react';

import { reportClientError } from './client-reporter';

export function useReportClientError(error: unknown): void {
  useEffect(() => {
    reportClientError(error, {
      component: 'react-boundary',
      errorType: 'render_error',
    });
  }, [error]);
}
