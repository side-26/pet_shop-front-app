import { SearchX } from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

type HeaderProductSearchEmptyFallbackProps = Readonly<{
  description: string;
}>;

export function HeaderProductSearchEmptyFallback({
  description,
}: HeaderProductSearchEmptyFallbackProps) {
  return (
    <Empty className="tw:min-h-40 tw:rounded-none tw:border-0 tw:px-5 tw:py-7">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchX aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>آیتمی پیدا نشد</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
