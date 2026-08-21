import { ValidationError } from 'yup';

import type { FetcherError } from '@/lib/api/customFetcher';

export function validationErrorToFetcherError(error: ValidationError): FetcherError {
  const validationErrors = error.inner.length > 0 ? error.inner : [error];

  return {
    isSuccess: false,
    message: null,
    data: {
      messages: validationErrors
        .filter((item) => item.path)
        .map((item) => ({ value: item.path!, label: item.message })),
      details: {},
    },
  };
}
