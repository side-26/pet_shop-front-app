'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { FormDialogContent } from '@/components/common/form-dialog-content';
import { MultipleImageUploaderField } from '@/components/common/multiple-image-uploader-field';
import { TextareaField } from '@/components/ui/fields/textarea-field';
import RichTextField from '@/components/ui/fields/rich-text-field';
import { TextField } from '@/components/ui/fields/text-field';
import { Form } from '@/components/ui/form';
import {
  useUpdateProductBaseInfo,
  useUpdateProductImages,
} from '@/entities/products/products.client';
import type {
  ProductBaseInfoDTO,
  ProductImagesDTO,
  ProductRelationDTO,
} from '@/entities/products/products.dto';
import {
  updateProductBaseInfoSchema,
  updateProductImagesSchema,
  type UpdateProductBaseInfoInput,
  type UpdateProductImagesInput,
} from '@/entities/products/products.schema';
import { cn } from '@/lib/utils';

import type { ProductFormOptions } from './product-form-options.types';
import { ProductBrandField, ProductRelationFields } from './product-relation-fields';
import type {
  ProductFormOptionsRequest,
  ProductSection,
  ProductSectionRequest,
} from './product-section-dialog.types';

const AsyncContent = dynamic(() => import('./product-section-dialog-content'));
const formId = (section: ProductSection) => `product-${section}-form`;
const relationId = (value: ProductRelationDTO | string | null | undefined) =>
  typeof value === 'string' ? value : (value?.id ?? '');
const emptyProductFormOptions: ProductFormOptions = {
  categories: [],
  subCategories: [],
  brands: [],
};
type Common = {
  section: ProductSection;
  isSkeleton?: boolean;
  data?: ProductBaseInfoDTO | ProductImagesDTO;
  options?: ProductFormOptions;
  base: ReturnType<typeof useUpdateProductBaseInfo>;
  images: ReturnType<typeof useUpdateProductImages>;
};

function SectionForm({
  section,
  isSkeleton = false,
  data,
  options,
  base: { formRef: baseFormRef, handleSubmit: baseSubmit },
  images: { formRef: imagesFormRef, handleSubmit: imagesSubmit },
}: Common) {
  const className = cn(isSkeleton && 'skeleton tw:pointer-events-none tw:select-none');
  if (section === 'images') {
    const value = data as ProductImagesDTO | undefined;
    return (
      <Form<UpdateProductImagesInput>
        ref={imagesFormRef}
        id={formId(section)}
        validationSchema={updateProductImagesSchema}
        options={{ defaultValues: { images: { images: [], mainImageIndex: 0 } } }}
        handleSubmit={imagesSubmit}
        aria-label="فرم تصاویر محصول"
        aria-busy={isSkeleton || undefined}
        className={className}
      >
        <fieldset
          disabled={isSkeleton}
          className="tw:flex tw:w-full tw:min-w-0 tw:flex-col tw:gap-4"
        >
          <MultipleImageUploaderField<UpdateProductImagesInput>
            name="images"
            label="تصاویر جایگزین"
            hint="حداکثر ۵ تصویر JPEG، PNG یا WebP برای جایگزینی بارگذاری کنید."
            defaultImages={value?.imagesList}
            mainImageUrl={value?.mainImage}
            disabled={isSkeleton}
          />
        </fieldset>
      </Form>
    );
  }
  const value = data as ProductBaseInfoDTO | undefined;
  const relationOptions = options ?? emptyProductFormOptions;
  return (
    <Form<UpdateProductBaseInfoInput>
      ref={baseFormRef}
      id={formId(section)}
      validationSchema={updateProductBaseInfoSchema}
      options={{
        defaultValues: {
          title: value?.title,
          summary: value?.summary,
          description: value?.description,
          category: value ? relationId(value.category) : '',
          brand: value ? relationId(value.brand) : '',
          subCategory: value?.subCategory ? relationId(value.subCategory) : null,
        },
      }}
      handleSubmit={baseSubmit}
      aria-label="فرم اطلاعات اصلی محصول"
      aria-busy={isSkeleton || undefined}
      className={className}
    >
      <fieldset disabled={isSkeleton} className="tw:flex tw:w-full tw:min-w-0 tw:flex-col tw:gap-4">
        <div className="tw:grid tw:gap-4 tw:sm:grid-cols-2">
          <TextField<UpdateProductBaseInfoInput> name="title" label="عنوان" />
          <ProductBrandField<UpdateProductBaseInfoInput>
            name="brand"
            options={relationOptions}
            disabled={isSkeleton}
          />
        </div>
        <div className="tw:grid tw:gap-4">
          <ProductRelationFields<UpdateProductBaseInfoInput>
            categoryName="category"
            subCategoryName="subCategory"
            options={relationOptions}
            disabled={isSkeleton}
          />
        </div>
        <TextareaField<UpdateProductBaseInfoInput>
          name="summary"
          label="خلاصه"
          maxLength={500}
          counter
        />
        <RichTextField<UpdateProductBaseInfoInput> name="description" label="توضیحات" />
      </fieldset>
    </Form>
  );
}

const titles: Record<ProductSection, string> = {
  'main-info': 'اطلاعات اصلی',
  images: 'تصاویر',
};
type Props = {
  productId: string;
  productTitle: string;
  section: ProductSection;
  request: ProductSectionRequest;
  optionsRequest: ProductFormOptionsRequest;
  onClose: () => void;
  onUpdated: () => void;
};

export function ProductSectionDialogContentWrapper({
  productId,
  productTitle,
  section,
  request,
  optionsRequest,
  onClose,
  onUpdated,
}: Props) {
  const base = useUpdateProductBaseInfo(productId, onUpdated);
  const images = useUpdateProductImages(productId, onUpdated);
  const pending =
    section === 'main-info'
      ? base.isPending
      : section === 'images'
        ? images.isPending
        : images.isPending;
  const formProps = { base, images };
  return (
    <FormDialogContent
      formId={formId(section)}
      isLoading={pending}
      onClose={onClose}
      submitText="ذخیره تغییرات"
      title={`${titles[section]} ${productTitle}`}
      size="lg"
      className="tw:max-w-[730px]"
      contentClassName="tw:max-h-[70dvh] tw:overflow-y-auto"
    >
      <Suspense fallback={<SectionForm section={section} isSkeleton {...formProps} />}>
        <AsyncContent request={request} optionsRequest={optionsRequest}>
          {(result, options) =>
            result.isSuccess ? (
              <SectionForm
                section={section}
                data={result.data}
                options={options.isSuccess ? options.data : undefined}
                {...formProps}
              />
            ) : (
              <p role="alert">{result.message}</p>
            )
          }
        </AsyncContent>
      </Suspense>
    </FormDialogContent>
  );
}
