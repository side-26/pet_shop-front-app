'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { FormDialogContent } from '@/components/common/form-dialog-content';
import { MultipleImageUploaderField } from '@/components/common/multiple-image-uploader-field';
import { TextareaField } from '@/components/ui/fields/textarea-field';
import { RichTextField } from '@/components/common/rich-text-field';
import { TextField } from '@/components/ui/fields/text-field';
import { PriceMaskField } from '@/components/ui/fields/price-mask-field';
import { Form } from '@/components/ui/form';
import {
  useUpdateProductBaseInfo,
  useUpdateProductImages,
  useUpdateProductPrice,
} from '@/entities/products/products.client';
import type {
  ProductBaseInfoDTO,
  ProductImagesDTO,
  ProductPriceDTO,
  ProductRelationDTO,
} from '@/entities/products/products.dto';
import {
  updateProductBaseInfoSchema,
  updateProductImagesSchema,
  updateProductPriceSchema,
  type UpdateProductBaseInfoInput,
  type UpdateProductImagesInput,
  type UpdateProductPriceInput,
} from '@/entities/products/products.schema';
import { cn } from '@/lib/utils';

import type { ProductFormOptions } from './product-form-options.types';
import { ProductRelationFields } from './product-relation-fields';
import type {
  ProductFormOptionsRequest,
  ProductSection,
  ProductSectionRequest,
} from './product-section-dialog.types';

const AsyncContent = dynamic(() => import('./product-section-dialog-content'));
const formId = (section: ProductSection) => `product-${section}-form`;
const relationId = (value: ProductRelationDTO | string) =>
  typeof value === 'string' ? value : value.id;
type Common = {
  section: ProductSection;
  isSkeleton?: boolean;
  data?: ProductBaseInfoDTO | ProductImagesDTO | ProductPriceDTO;
  options?: ProductFormOptions;
  base: ReturnType<typeof useUpdateProductBaseInfo>;
  images: ReturnType<typeof useUpdateProductImages>;
  price: ReturnType<typeof useUpdateProductPrice>;
};

function SectionForm({
  section,
  isSkeleton = false,
  data,
  options,
  base: { formRef: baseFormRef, handleSubmit: baseSubmit },
  images: { formRef: imagesFormRef, handleSubmit: imagesSubmit },
  price: { formRef: priceFormRef, handleSubmit: priceSubmit },
}: Common) {
  const className = cn(isSkeleton && 'skeleton tw:pointer-events-none tw:select-none');
  if (section === 'price') {
    const value = data as ProductPriceDTO | undefined;
    return (
      <Form<UpdateProductPriceInput>
        ref={priceFormRef}
        id={formId(section)}
        validationSchema={updateProductPriceSchema}
        options={{
          defaultValues: { price: value?.price, discountPercentage: value?.discountPercentage },
        }}
        handleSubmit={priceSubmit}
        aria-label="فرم قیمت محصول"
        aria-busy={isSkeleton || undefined}
        className={className}
      >
        <fieldset
          disabled={isSkeleton}
          className="tw:grid tw:w-full tw:min-w-0 tw:gap-4 tw:sm:grid-cols-2"
        >
          <PriceMaskField<UpdateProductPriceInput> name="price" label="قیمت" min={0} />
          <TextField<UpdateProductPriceInput>
            name="discountPercentage"
            label="درصد تخفیف"
            type="number"
            min={0}
            max={100}
          />
        </fieldset>
      </Form>
    );
  }
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
          subCategory: value?.subCategory ? relationId(value.subCategory) : null,
          quantity: value?.quantity,
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
          <TextField<UpdateProductBaseInfoInput>
            name="quantity"
            label="موجودی"
            type="number"
            min={0}
          />
          {options ? (
            <ProductRelationFields<UpdateProductBaseInfoInput>
              categoryName="category"
              subCategoryName="subCategory"
              options={options}
              disabled={isSkeleton}
            />
          ) : null}
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
  price: 'قیمت',
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
  const price = useUpdateProductPrice(productId, onUpdated);
  const pending =
    section === 'main-info'
      ? base.isPending
      : section === 'images'
        ? images.isPending
        : price.isPending;
  const formProps = { base, images, price };
  return (
    <FormDialogContent
      formId={formId(section)}
      isLoading={pending}
      onClose={onClose}
      submitText="ذخیره تغییرات"
      title={`${titles[section]} ${productTitle}`}
      size="lg"
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
