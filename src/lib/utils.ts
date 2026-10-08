import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FetcherResult, FetcherSuccess } from './api/fetcher.shared';

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
