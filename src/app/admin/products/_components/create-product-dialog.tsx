'use client';

import { FormDialogContent } from '@/components/common/form-dialog-content';
import { MultipleImageUploaderField } from '@/components/common/multiple-image-uploader-field';
import { Dialog } from '@/components/ui/dialog';
import { TextareaField } from '@/components/ui/fields/textarea-field';
import { TextField } from '@/components/ui/fields/text-field';
import { Form } from '@/components/ui/form';
import { useCreateProduct } from '@/entities/products/products.client';
import { productSchema, type ProductInput } from '@/entities/products/products.schema';

import type { ProductFormOptions } from './product-form-options.types';
import { ProductRelationFields } from './product-relation-fields';

const FORM_ID = 'create-product-form';
type Props = {
  open: boolean;
  options?: ProductFormOptions;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
};

export function CreateProductDialog({ open, options, onOpenChange, onCreated }: Props) {
  const { formRef, handleSubmit, isPending } = useCreateProduct(onCreated);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <FormDialogContent
        formId={FORM_ID}
        title="افزودن محصول جدید"
        submitText="ایجاد محصول"
        size="xl"
        isLoading={isPending}
        onClose={() => onOpenChange(false)}
        contentClassName="tw:max-h-[72dvh] tw:overflow-y-auto"
      >
        <Form<ProductInput>
          ref={formRef}
          id={FORM_ID}
          validationSchema={productSchema}
          options={{
            defaultValues: {
              title: '',
              summary: '',
              description: '',
              category: '',
              subCategory: null,
              quantity: 0,
              images: { images: [], mainImageIndex: 0 },
            },
          }}
          handleSubmit={handleSubmit}
          aria-label="فرم ایجاد محصول"
        >
          <fieldset className="tw:flex tw:w-full tw:min-w-0 tw:flex-col tw:gap-5">
            <div className="tw:grid tw:gap-4 tw:sm:grid-cols-2">
              <TextField<ProductInput> name="title" label="عنوان" required />
              <TextField<ProductInput>
                name="quantity"
                label="موجودی"
                type="number"
                min={0}
                required
              />
              {options ? (
                <ProductRelationFields<ProductInput>
                  categoryName="category"
                  subCategoryName="subCategory"
                  options={options}
                />
              ) : null}
            </div>
            <TextareaField<ProductInput> name="summary" label="خلاصه" maxLength={500} counter />
            <TextareaField<ProductInput>
              name="description"
              label="توضیحات"
              maxLength={5000}
              counter
              required
            />
            <MultipleImageUploaderField<ProductInput>
              name="images"
              label="تصاویر محصول"
              hint="حداکثر ۵ تصویر JPEG، PNG یا WebP انتخاب و تصویر اصلی را مشخص کنید."
            />
          </fieldset>
        </Form>
      </FormDialogContent>
    </Dialog>
  );
}
