import { FileQuestionIcon } from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export function ArticlePreviewEmptyFetchSection() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileQuestionIcon aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>مقاله‌ای برای پیش‌نمایش یافت نشد</EmptyTitle>
        <EmptyDescription>ممکن است مقاله حذف شده باشد یا دیگر در دسترس شما نباشد.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
