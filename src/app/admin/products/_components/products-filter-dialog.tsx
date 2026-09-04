'use client';

import { useRouter } from 'next/navigation';

import { FilterFormDialogContent } from '@/components/common/filter-form-dialog-content';
import { Dialog } from '@/components/ui/dialog';
import { SelectField } from '@/components/ui/fields/select-field';
import { TextField } from '@/components/ui/fields/text-field';
import { PriceMaskField } from '@/components/ui/fields/price-mask-field';
import { Form } from '@/components/ui/form';
import { routePaths } from '@/configs/route.path';

import type { ProductFormOptions } from './product-form-options.types';
import { ProductRelationFields } from './product-relation-fields';
import type { ProductsFilterValues } from './products-filter.helpers';

const FORM_ID = 'products-filter-form';
const enabledOptions = [
  { label: 'هر دو', value: null },
  { label: 'فعال', value: true },
  { label: 'غیرفعال', value: false },
] as const;
const sortOptions = [
  { label: 'پیش‌فرض', value: '' },
  { label: 'عنوان', value: 'title' },
  { label: 'تاریخ ایجاد', value: 'createdAt' },
  { label: 'تاریخ ویرایش', value: 'updatedAt' },
  { label: 'قیمت', value: 'price' },
  { label: 'موجودی', value: 'quantity' },
] as const;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<ProductsFilterValues>;
  options: ProductFormOptions;
};

export function ProductsFilterDialog({ open, onOpenChange, initialValues, options }: Props) {
  const router = useRouter();
  const defaults: ProductsFilterValues = {
    title: initialValues?.title ?? '',
    category: initialValues?.category ?? '',
    subCategory: initialValues?.subCategory ?? '',
    quantity: initialValues?.quantity,
    price: initialValues?.price,
    isEnable: initialValues?.isEnable ?? null,
    page: initialValues?.page ?? 1,
    limit: initialValues?.limit ?? 10,
    sort: initialValues?.sort ?? '',
    includeDisabled: true,
  };
  function submit(values: ProductsFilterValues) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(values))
      if (key !== 'page' && key !== 'includeDisabled' && value !== '' && value != null)
        params.set(key, String(value));
    params.set('page', '1');
    router.push(routePaths.adminProductsQuery(params), { scroll: false });
    onOpenChange(false);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <FilterFormDialogContent
        formId={FORM_ID}
        title="فیلتر محصولات"
        size="lg"
        onClose={() => onOpenChange(false)}
        contentClassName="tw:grid tw:gap-4 tw:sm:grid-cols-2"
      >
        <Form<ProductsFilterValues>
          key={JSON.stringify({ open, defaults })}
          id={FORM_ID}
          options={{ defaultValues: defaults }}
          handleSubmit={submit}
          className="tw:contents"
          aria-label="فیلتر محصولات"
        >
          <TextField<ProductsFilterValues> name="title" label="عنوان" />
          <ProductRelationFields<ProductsFilterValues>
            categoryName="category"
            subCategoryName="subCategory"
            options={options}
          />
          <TextField<ProductsFilterValues> name="quantity" label="موجودی" type="number" min={0} />
          <PriceMaskField<ProductsFilterValues> name="price" label="قیمت" min={0} />
          <SelectField<ProductsFilterValues>
            name="isEnable"
            label="وضعیت"
            options={enabledOptions}
          />
          <SelectField<ProductsFilterValues> name="sort" label="مرتب‌سازی" options={sortOptions} />
        </Form>
      </FilterFormDialogContent>
    </Dialog>
  );
}
