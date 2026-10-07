import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';

export function ArticlesTableEmptyState() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>مقاله‌ای برای نمایش وجود ندارد</EmptyTitle>
        <EmptyDescription>
          پس از ایجاد مقاله، فهرست آن در این بخش نمایش داده می‌شود.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
