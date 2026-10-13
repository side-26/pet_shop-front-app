import { BookOpenTextIcon } from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export function ArticlesCatalogEmptyFetch() {
  return (
    <Empty className="tw:min-h-80 tw:border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BookOpenTextIcon aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>هنوز مقاله‌ای برای نمایش نیست</EmptyTitle>
        <EmptyDescription>به‌زودی راهنماهای تازه و کاربردی اینجا منتشر می‌شوند.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
