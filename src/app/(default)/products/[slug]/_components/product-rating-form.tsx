'use client';

import { Send } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { RateField } from '@/components/ui/fields/rate-field';
import { toast } from '@/components/ui/toast';
import { updateProductUserRateAction } from '@/entities/products/products.actions';
import { retryLandingProductDetailAction } from '@/entities/landing/landing.actions';
import { globalErrorHandler } from '@/utils/helpers';

type RatingFormValue = { userRate: number };

type ProductRatingFormProps = Readonly<{
  canVote: boolean;
  hasRated: boolean;
  productId: string;
  slug: string;
}>;

export function ProductRatingForm({ canVote, hasRated, productId, slug }: ProductRatingFormProps) {
  const [submitted, setSubmitted] = useState(false);

  if (hasRated || submitted) {
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

  async function submitRating({ userRate }: RatingFormValue) {
    const result = await updateProductUserRateAction({ id: productId, userRate });
    if (!result.isSuccess) {
      globalErrorHandler(result);
      return;
    }

    setSubmitted(true);
    toast.add({ type: 'success', title: result.message || 'امتیاز شما ثبت شد.' });
    await retryLandingProductDetailAction(slug);
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
            size="lg"
            hint="از یک تا پنج ستاره انتخاب کنید."
            rules={{ min: { value: 1, message: 'لطفاً حداقل یک ستاره انتخاب کنید.' } }}
          />
          <Button
            type="submit"
            size="sm"
            variant="tonal"
            className="tw:self-start"
            isLoading={formState.isSubmitting}
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
