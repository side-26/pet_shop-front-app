'use client';

import { FilterFormDialogContent } from '@/components/common/filter-form-dialog-content';
import { Dialog } from '@/components/ui/dialog';
import { SelectField } from '@/components/ui/fields/select-field';
import { Form } from '@/components/ui/form';
import { routePaths } from '@/configs/route.path';
import { ORDER_DELIVERY_STATES, ORDER_SORT_FIELDS } from '@/entities/orders/orders.schema';
import { useRouter } from '@/hooks/use-router';

const FORM_ID = 'orders-filter-form';

type OrdersFilterValues = {
  deliveryState: string;
  sort: string;
};

type OrdersFilterDialogContentProps = Readonly<{
  initialQuery: Record<string, string>;
  onExitComplete: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}>;

const deliveryStateOptions = [
  { value: '', label: 'همه وضعیت‌های ارسال' },
  { value: '0', label: 'در انتظار بررسی' },
  { value: '1', label: 'در حال آماده‌سازی' },
  { value: '2', label: 'ارسال شده' },
  { value: '3', label: 'تحویل شده' },
] as const;

const sortOptions = [
  { value: 'createdAt', label: 'تاریخ ایجاد' },
  { value: 'updatedAt', label: 'تاریخ ویرایش' },
  { value: 'totalPrice', label: 'مبلغ کل' },
  { value: 'deliveryState', label: 'وضعیت ارسال' },
] as const;

function defaultsFrom(query: Record<string, string>): OrdersFilterValues {
  const deliveryState = Number(query.deliveryState);
  const sort = ORDER_SORT_FIELDS.includes(query.sort as (typeof ORDER_SORT_FIELDS)[number])
    ? query.sort
    : 'createdAt';
  return {
    deliveryState: ORDER_DELIVERY_STATES.includes(
      deliveryState as (typeof ORDER_DELIVERY_STATES)[number],
    )
      ? String(deliveryState)
      : '',
    sort,
  };
}

export default function OrdersFilterDialogContent({
  initialQuery,
  onExitComplete,
  onOpenChange,
  open,
}: OrdersFilterDialogContentProps) {
  const router = useRouter();
  const defaultValues = defaultsFrom(initialQuery);

  function submit(values: OrdersFilterValues) {
    const query = new URLSearchParams();

    if (values.deliveryState) query.set('deliveryState', values.deliveryState);
    if (values.sort !== 'createdAt') query.set('sort', values.sort);
    if (initialQuery.limit) query.set('limit', initialQuery.limit);
    query.set('page', '1');

    router.push(routePaths.adminOrdersQuery(query), { scroll: false });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <FilterFormDialogContent
        formId={FORM_ID}
        title="فیلتر سفارش‌ها"
        size="md"
        onClose={() => onOpenChange(false)}
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget && !open) onExitComplete();
        }}
      >
        <Form<OrdersFilterValues>
          key={JSON.stringify({ open, defaultValues })}
          id={FORM_ID}
          options={{ defaultValues }}
          handleSubmit={submit}
          aria-label="فیلتر سفارش‌ها"
        >
          <SelectField<OrdersFilterValues>
            name="deliveryState"
            label="وضعیت ارسال"
            options={deliveryStateOptions}
          />
          <SelectField<OrdersFilterValues> name="sort" label="مرتب‌سازی" options={sortOptions} />
        </Form>
      </FilterFormDialogContent>
    </Dialog>
  );
}
