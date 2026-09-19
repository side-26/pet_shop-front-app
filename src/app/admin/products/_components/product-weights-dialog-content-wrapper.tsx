'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { CirclePlusIcon, Trash2Icon } from 'lucide-react';
import { useFieldArray, useFormContext, type FieldPath } from 'react-hook-form';

import { FormDialogContent } from '@/components/common/form-dialog-content';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/fields/text-field';
import { PriceMaskField } from '@/components/ui/fields/price-mask-field';
import { Form } from '@/components/ui/form';
import { getProductWeightsAction } from '@/entities/products/products.actions';
import { useReplaceProductWeights } from '@/entities/products/products.client';
import type { ProductWeightDTO } from '@/entities/products/products.dto';
import {
  replaceProductWeightsSchema,
  type ReplaceProductWeightsInput,
} from '@/entities/products/products.schema';
import { cn } from '@/lib/utils';

const AsyncProductWeightsDialogContent = dynamic(() => import('./product-weights-dialog-content'));
const FORM_ID = 'product-weights-form';
const EMPTY_WEIGHT = { metric: 'KG', value: 1, quantity: 0, price: 0, discountPercentage: 0 };
const LOADING_WEIGHTS = [EMPTY_WEIGHT, EMPTY_WEIGHT];
type ProductWeightsFormInput = Pick<ReplaceProductWeightsInput, 'weights'>;

function WeightFields({ disabled = false }: { disabled?: boolean }) {
  const { control } = useFormContext<ProductWeightsFormInput>();
  const { append, fields, remove } = useFieldArray({ control, name: 'weights' });
  return (
    <fieldset disabled={disabled} className="tw:flex tw:w-full tw:min-w-0 tw:flex-col tw:gap-3">
      <legend className="tw:text-title-s tw:text-foreground">وزن‌ها و قیمت‌ها</legend>
      {fields.map((field, index) => {
        const name = `weights.${index}` as FieldPath<ProductWeightsFormInput>;
        return (
          <div
            key={field.id}
            className="tw:flex tw:flex-col tw:gap-3 tw:rounded-2xl tw:border tw:border-border tw:bg-muted/25 tw:p-3"
          >
            <div className="tw:grid tw:grid-cols-1 tw:gap-3 tw:sm:grid-cols-2">
              <TextField<ProductWeightsFormInput>
                name={`${name}.metric` as FieldPath<ProductWeightsFormInput>}
                label="واحد وزن"
                placeholder="KG"
              />
              <TextField<ProductWeightsFormInput>
                name={`${name}.value` as FieldPath<ProductWeightsFormInput>}
                label="مقدار وزن"
                type="number"
                min={0.01}
                step="any"
              />
            </div>
            <div className="tw:grid tw:grid-cols-1 tw:gap-3 tw:sm:grid-cols-3">
              <TextField<ProductWeightsFormInput>
                name={`${name}.quantity` as FieldPath<ProductWeightsFormInput>}
                label="موجودی این وزن"
                type="number"
                min={0}
              />
              <PriceMaskField<ProductWeightsFormInput>
                name={`${name}.price` as FieldPath<ProductWeightsFormInput>}
                label="قیمت"
                min={0}
              />
              <TextField<ProductWeightsFormInput>
                name={`${name}.discountPercentage` as FieldPath<ProductWeightsFormInput>}
                label="درصد تخفیف"
                type="number"
                min={0}
                max={100}
              />
            </div>
            <Button
              type="button"
              iconOnly
              variant="flat"
              color="error"
              aria-label={`حذف وزن ${index + 1}`}
              className="tw:self-end"
              onClick={() => remove(index)}
            >
              <Trash2Icon aria-hidden="true" />
            </Button>
          </div>
        );
      })}
      <Button
        type="button"
        variant="outlined"
        color="primary"
        disabled={disabled || fields.length >= 50}
        onClick={() => append(EMPTY_WEIGHT)}
      >
        <CirclePlusIcon data-icon="inline-start" aria-hidden="true" />
        افزودن وزن
      </Button>
    </fieldset>
  );
}

type FormBodyProps = {
  formRef: ReturnType<typeof useReplaceProductWeights>['formRef'];
  handleSubmit: ReturnType<typeof useReplaceProductWeights>['handleSubmit'];
  isSkeleton?: boolean;
  weights?: ProductWeightDTO[];
};

export function ProductWeightsFormBody({
  formRef,
  handleSubmit,
  isSkeleton = false,
  weights = LOADING_WEIGHTS,
}: FormBodyProps) {
  return (
    <Form<ProductWeightsFormInput>
      ref={formRef}
      id={FORM_ID}
      validationSchema={replaceProductWeightsSchema.omit(['id'])}
      options={{ defaultValues: { weights } }}
      handleSubmit={handleSubmit}
      aria-label="فرم ویرایش وزن‌ها و قیمت‌های محصول"
      aria-busy={isSkeleton || undefined}
      className={cn(isSkeleton && 'skeleton tw:pointer-events-none tw:select-none')}
    >
      <WeightFields disabled={isSkeleton} />
    </Form>
  );
}

type Props = {
  productId: string;
  productTitle: string;
  request: ReturnType<typeof getProductWeightsAction>;
  onClose: () => void;
  onUpdated: () => void;
};

export function ProductWeightsDialogContentWrapper({
  productId,
  productTitle,
  request,
  onClose,
  onUpdated,
}: Props) {
  const { formRef, handleSubmit, isPending } = useReplaceProductWeights(productId, onUpdated);
  const fallback = (
    <ProductWeightsFormBody formRef={formRef} handleSubmit={handleSubmit} isSkeleton />
  );
  return (
    <FormDialogContent
      formId={FORM_ID}
      isLoading={isPending}
      onClose={onClose}
      submitText="ذخیره وزن‌ها"
      title={`وزن‌ها و قیمت‌های ${productTitle}`}
      size="lg"
      className="tw:max-w-[730px]"
      contentClassName="tw:max-h-[70dvh] tw:overflow-y-auto"
    >
      <Suspense fallback={fallback}>
        <AsyncProductWeightsDialogContent request={request}>
          {(result) =>
            result.isSuccess ? (
              <ProductWeightsFormBody
                formRef={formRef}
                handleSubmit={handleSubmit}
                weights={result.data}
              />
            ) : (
              <p role="alert">{result.message}</p>
            )
          }
        </AsyncProductWeightsDialogContent>
      </Suspense>
    </FormDialogContent>
  );
}
