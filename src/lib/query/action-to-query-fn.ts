import type { FetcherResult } from '@/lib/api/fetcher.shared';

export function actionToQueryFn<TArgs extends unknown[], TData>(
  action: (...args: TArgs) => Promise<FetcherResult<TData>>,
  ...args: TArgs
): () => Promise<TData> {
  return async () => {
    const result = await action(...args);

    if (!result.isSuccess) {
      throw new Error(result.message ?? 'خطا در دریافت اطلاعات');
    }

    return result.data;
  };
}
