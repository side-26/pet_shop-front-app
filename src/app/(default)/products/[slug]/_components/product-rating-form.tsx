'use client';

import { Send } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { RateField } from '@/components/ui/fields/rate-field';
import { useUpdateProductUserRate } from '@/entities/products/products.client';

type RatingFormValue = { userRate: number };

type ProductRatingFormProps = Readonly<{
  canVote: boolean;
  hasRated: boolean;
  productId: string;
}>;

export function ProductRatingForm({ canVote, hasRated, productId }: ProductRatingFormProps) {
  const [savedUserRate, setSavedUserRate] = useState<number | null>(null);
  const updateProductUserRate = useUpdateProductUserRate(productId);
  const optimisticUserRate = updateProductUserRate.isPending
    ? updateProductUserRate.variables?.userRate
    : savedUserRate;
  const hasOptimisticRating = hasRated || optimisticUserRate != null;

  if (hasOptimisticRating) {
    return (
      <p className="tw:text-label-m tw:text-success">امتیاز شما برای این محصول ثبت شده است.</p>
    );
  }

  if (!canVote) {
    return (
      <p className="tw:text-label-m tw:text-muted-foreground">
        امتیازدهی برای مشتریانی فعال است که این محصول را خریداری کرده‌اند.
      </p>
    );
  }

  function submitRating({ userRate }: RatingFormValue) {
    updateProductUserRate.mutate(
      { id: productId, userRate },
      {
        onSuccess: ({ userRate: savedUserRate }) => {
          setSavedUserRate(savedUserRate);
        },
      },
    );
  }

  return (
    <Form<RatingFormValue>
      aria-label="فرم امتیازدهی محصول"
      className="tw:gap-3"
      handleSubmit={submitRating}
      options={{ defaultValues: { userRate: 0 } }}
    >
      {({ formState }) => (
        <>
          <RateField<RatingFormValue>
            name="userRate"
            size="sm"
            className="tw:self-start"
            rules={{ min: { value: 1, message: 'لطفاً حداقل یک ستاره انتخاب کنید.' } }}
            disabled={updateProductUserRate.isPending}
          />
          <Button
            type="submit"
            size="sm"
            variant="tonal"
            className="tw:self-start"
            isLoading={formState.isSubmitting || updateProductUserRate.isPending}
            loadingText="در حال ثبت امتیاز..."
          >
            <Send data-icon="inline-start" aria-hidden="true" />
            ثبت امتیاز
          </Button>
        </>
      )}
    </Form>
  );
}
