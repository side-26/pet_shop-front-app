import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';

export function CategoriesSectionEmptyState() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>دسته‌بندی برای نمایش وجود ندارد</EmptyTitle>
        <EmptyDescription>به‌زودی دسته‌بندی‌های حیوانات اضافه می‌شود.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
