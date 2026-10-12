import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FetcherError, FetcherResult, FetcherSuccess } from './api/fetcher.shared';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function unwrapResult<TData>(
  promise: Promise<FetcherResult<TData>>,
  customErrorMessage = 'خطا در دریافت اطلاعات',
): Promise<TData> {
  const result = await promise;

  if (!result.isSuccess) {
    throw new Error(result.message ?? customErrorMessage);
  }

  return result.data;
}

export async function unwrapValidate<T extends object>(
  promise: Promise<T | FetcherError>,
  defaultErrorMessage = 'ورودی نامعتبر است.',
): Promise<T> {
  const result = await promise;

  if ('isSuccess' in result) {
    throw new Error(result.message ?? defaultErrorMessage);
  }

  return result;
}
