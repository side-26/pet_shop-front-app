import type { getProfileOrderSummaryAction } from '@/entities/profile/profile.actions';

import { UserOrderSummarySectionFetchError } from './user-order-summary-section-fetch-error';
import { UserOrderSummarySectionRenderer } from './user-order-summary-section-renderer';

type Props = Readonly<{
  summaryPromise: ReturnType<typeof getProfileOrderSummaryAction>;
}>;

export async function UserOrderSummarySectionContainer({ summaryPromise }: Props) {
  const result = await summaryPromise;

  if (!result?.isSuccess) {
    return <UserOrderSummarySectionFetchError description={result?.message} />;
  }

  return <UserOrderSummarySectionRenderer summary={result.data} />;
}
