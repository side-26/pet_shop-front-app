'use client';
import { ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { ShowcaseSection } from './showcase-section';

type Order = {
  id: string;
  customer: string;
  amount: string;
  status: 'success' | 'warning' | 'error';
};
const data: Order[] = [
  { id: 'PET-1042', customer: 'سارا احمدی', amount: '۱٬۲۵۰٬۰۰۰ تومان', status: 'success' },
  { id: 'PET-1043', customer: 'علی رضایی', amount: '۸۹۰٬۰۰۰ تومان', status: 'warning' },
  { id: 'PET-1044', customer: 'مریم کریمی', amount: '۲٬۱۰۰٬۰۰۰ تومان', status: 'error' },
  { id: 'PET-1045', customer: 'رضا محمدی', amount: '۵۴۰٬۰۰۰ تومان', status: 'success' },
  { id: 'PET-1046', customer: 'نازنین اکبری', amount: '۷۶۰٬۰۰۰ تومان', status: 'success' },
  { id: 'PET-1047', customer: 'امیر حسینی', amount: '۳۳۰٬۰۰۰ تومان', status: 'warning' },
];
const labels = { success: 'تکمیل', warning: 'در انتظار', error: 'ناموفق' } as const;
const columns: ColumnDef<Order>[] = [
  { accessorKey: 'id', header: 'شناسه', cell: ({ row }) => <bdi dir="ltr">{row.original.id}</bdi> },
  {
    accessorKey: 'customer',
    header: ({ column }) => (
      <Button
        variant="flat"
        color="primary"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        مشتری
        <ArrowUpDown data-icon="inline-end" />
      </Button>
    ),
  },
  { accessorKey: 'amount', header: 'مبلغ' },
  {
    accessorKey: 'status',
    header: 'وضعیت',
    cell: ({ row }) => (
      <Badge variant="tonal" color={row.original.status}>
        {labels[row.original.status]}
      </Badge>
    ),
  },
];
export function DataTableShowcase() {
  return (
    <ShowcaseSection
      id="data-tables"
      title="Data Table"
      description="جدول داده TanStack با مرتب‌سازی، صفحه‌بندی، وضعیت خالی و محتوای ترکیبی RTL/LTR."
    >
      <DataTable columns={columns} data={data} getRowId={(row) => row.id} pageSize={4} />
      <DataTable columns={columns} data={[]} emptyLabel="سفارشی پیدا نشد." />
    </ShowcaseSection>
  );
}
