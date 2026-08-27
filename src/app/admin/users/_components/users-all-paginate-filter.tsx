'use client';

import { SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { FilterFormDialogContent } from '@/components/common/filter-form-dialog-content';
import { Dialog } from '@/components/ui/dialog';
import { SelectField } from '@/components/ui/fields/select-field';
import { SwitchField } from '@/components/ui/fields/switch-field';
import { TextField } from '@/components/ui/fields/text-field';
import { Form } from '@/components/ui/form';
import { USER_ROLES } from '@/configs/user-role';
import { routePaths } from '@/configs/route.path';

import {
  createUsersFilterFormValues,
  type UsersAllPaginateFilterValues,
} from './users-filter.helpers';

const USERS_FILTER_FORM_ID = 'users-all-paginate-filter';

const roleOptions = [
  { label: 'همه نقش‌ها', value: '' },
  { label: 'مدیر', value: USER_ROLES.ADMIN },
  { label: 'فروشنده', value: USER_ROLES.SELLER },
  { label: 'مشتری', value: USER_ROLES.CUSTOMER },
] as const;

const sortOptions = [
  { label: 'بدون مرتب‌سازی', value: '' },
  { label: 'صعودی', value: 'asc' },
  { label: 'نزولی', value: 'dsc' },
] as const;

type UsersAllPaginateFilterProps = {
  initialValues?: Partial<UsersAllPaginateFilterValues>;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

function toSearchParams(values: UsersAllPaginateFilterValues) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(values)) {
    if (value === '' || value === undefined || key === 'page') continue;
    params.set(key, String(value));
  }

  params.set('page', '1');
  return params;
}

function UsersAllPaginateFilter({
  initialValues,
  onOpenChange,
  open,
}: UsersAllPaginateFilterProps) {
  const router = useRouter();

  const defaultValues = createUsersFilterFormValues(initialValues);
  const formStateKey = JSON.stringify({ open, defaultValues });

  function handleSubmit(values: UsersAllPaginateFilterValues) {
    router.push(routePaths.adminUsersQuery(toSearchParams(values)), { scroll: false });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <FilterFormDialogContent
        onClose={() => onOpenChange(false)}
        formId={USERS_FILTER_FORM_ID}
        contentClassName="tw:grid tw:gap-4 tw:sm:grid-cols-2"
        title="فیلتر کاربران"
        size="lg"
      >
        <Form<UsersAllPaginateFilterValues>
          key={formStateKey}
          id={USERS_FILTER_FORM_ID}
          handleSubmit={handleSubmit}
          options={{ defaultValues }}
          className="tw:contents"
          aria-label="فیلتر کاربران"
        >
          <>
            <TextField<UsersAllPaginateFilterValues>
              name="fullName"
              label="نام و نام خانوادگی"
              placeholder="نام کاربر"
              prefixIcon={<SearchIcon />}
            />
            <TextField<UsersAllPaginateFilterValues>
              name="phoneNumber"
              label="شماره موبایل"
              type="tel"
              inputMode="tel"
              placeholder="09123456789"
            />
            <TextField<UsersAllPaginateFilterValues>
              name="nationalCode"
              label="کد ملی"
              inputMode="numeric"
              placeholder="0012345678"
            />
            <SelectField<UsersAllPaginateFilterValues>
              id="users-filter-role"
              name="role"
              label="نقش"
              options={roleOptions}
              placeholder="همه نقش‌ها"
            />
            <SelectField<UsersAllPaginateFilterValues>
              id="users-filter-sort"
              name="sort"
              label="مرتب‌سازی"
              options={sortOptions}
              placeholder="بدون مرتب‌سازی"
            />
            <SwitchField<UsersAllPaginateFilterValues>
              name="isEnable"
              label="فقط کاربران فعال"
              hint="کاربران غیرفعال نمایش داده نمی‌شوند."
              className="tw:sm:col-span-2"
            />
          </>
        </Form>
      </FilterFormDialogContent>
    </Dialog>
  );
}

export {
  UsersAllPaginateFilter,
  USERS_FILTER_FORM_ID,
  toSearchParams,
  type UsersAllPaginateFilterProps,
  type UsersAllPaginateFilterValues,
};
