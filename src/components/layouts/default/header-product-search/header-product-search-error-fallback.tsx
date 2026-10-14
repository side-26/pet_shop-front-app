import { CircleAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

type HeaderProductSearchErrorFallbackProps = Readonly<{
  onRetry?: () => void;
}>;

export function HeaderProductSearchErrorFallback({
  onRetry,
}: HeaderProductSearchErrorFallbackProps) {
  return (
    <Empty className="tw:min-h-40 tw:rounded-none tw:border-0 tw:px-5 tw:py-7">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CircleAlert aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>نمایش نتایج ممکن نیست</EmptyTitle>
        <EmptyDescription>لطفاً کمی بعد دوباره جستجو کنید.</EmptyDescription>
      </EmptyHeader>
      {onRetry ? (
        <Button type="button" variant="outlined" color="secondary" size="sm" onClick={onRetry}>
          تلاش مجدد
        </Button>
      ) : null}
    </Empty>
  );
}
