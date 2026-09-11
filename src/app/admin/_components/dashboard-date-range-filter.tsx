'use client';

import { useRouter } from 'nextjs-toploader/app';

import { FilterFormDialogContent } from '@/components/common/filter-form-dialog-content';
import { Dialog } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { RangedDatePicker } from '@/components/ui/ranged-date-picker';
import { routePaths } from '@/configs/route.path';

import {
  toDashboardDateRangeSearchParams,
  type DashboardDateRangeFilterValues,
} from './dashboard-date-range-filter.helpers';

const FORM_ID = 'dashboard-date-range-filter-form';

type DashboardDateRangeFilterProps = {
  initialValues?: DashboardDateRangeFilterValues;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DashboardDateRangeFilter({
  initialValues,
  open,
  onOpenChange,
}: DashboardDateRangeFilterProps) {
  const router = useRouter();
  const defaultValues: DashboardDateRangeFilterValues = {
    fromDate: initialValues?.fromDate ?? '',
    toDate: initialValues?.toDate ?? '',
  };

  function submit(values: DashboardDateRangeFilterValues) {
    router.push(routePaths.adminDashboardQuery(toDashboardDateRangeSearchParams(values)), {
      scroll: false,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <FilterFormDialogContent
        formId={FORM_ID}
        title="بازه زمانی داشبورد"
        size="sm"
        onClose={() => onOpenChange(false)}
      >
        <Form<DashboardDateRangeFilterValues>
          key={JSON.stringify({ open, defaultValues })}
          id={FORM_ID}
          options={{ defaultValues }}
          handleSubmit={submit}
          aria-label="فیلتر بازه زمانی داشبورد"
        >
          <RangedDatePicker<DashboardDateRangeFilterValues>
            fromDateKey="fromDate"
            toDateKey="toDate"
            label="بازه زمانی"
            hint="تاریخ و ساعت شروع و پایان را انتخاب کنید."
            hasTime
          />
        </Form>
      </FilterFormDialogContent>
    </Dialog>
  );
}
