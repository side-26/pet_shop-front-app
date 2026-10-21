import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';

export function OrdersTableEmpty() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>سفارشی برای نمایش وجود ندارد</EmptyTitle>
        <EmptyDescription>با تغییر صفحه یا فیلترها دوباره تلاش کنید.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
