'use client';

import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import { toast } from '@/components/ui/toast';
import type { FetcherError } from '@/lib/api/customFetcher';

export interface GlobalErrorHandlerOptions<
  TBackendError,
  TFieldValues extends FieldValues = FieldValues,
> {
  showErrorFields?: UseFormSetError<TFieldValues>;
  onCustomError?: (error?: FetcherError<TBackendError>) => void;
  ignore?: boolean;
}

export function globalErrorHandler<
  TBackendError = unknown,
  TFieldValues extends FieldValues = FieldValues,
>(
  errorFullData: FetcherError<TBackendError>,
  options: GlobalErrorHandlerOptions<TBackendError, TFieldValues> = {},
): void {
  const { ignore = false, onCustomError, showErrorFields } = options;

  if (!ignore) {
    if (errorFullData.message) {
      toast.add({ type: 'error', title: errorFullData.message });
    }

    if (showErrorFields && Array.isArray(errorFullData.data.messages)) {
      for (const fieldError of errorFullData.data.messages) {
        showErrorFields(fieldError.value as Path<TFieldValues>, {
          type: 'server',
          message: fieldError.label,
        });
      }
    }
  }

  onCustomError?.(errorFullData);
}
