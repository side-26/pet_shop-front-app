'use client';

import { Send } from 'lucide-react';
import { useOptimistic, useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { RateField } from '@/components/ui/fields/rate-field';
import { toast } from '@/components/ui/toast';
import { useUpdateProductUserRate } from '@/entities/products/products.client';
import { globalErrorHandler } from '@/utils/helpers';

type RatingFormValue = { userRate: number };
type RatingState = { hasRated: boolean; userRate: number };
type RatingAction =
  | { type: 'submit'; userRate: number }
  | { type: 'save'; userRate: number }
  | { type: 'revert'; previous: RatingState };

function ratingReducer(state: RatingState, action: RatingAction): RatingState {
  switch (action.type) {
    case 'submit':
      return { ...state, userRate: action.userRate };
    case 'save':
      return { hasRated: true, userRate: action.userRate };
    case 'revert':
      return action.previous;
  }
}

type ProductRatingFormProps = Readonly<{
  canVote: boolean;
  hasRated: boolean;
  productId: string;
}>;

export function ProductRatingForm({ canVote, hasRated, productId }: ProductRatingFormProps) {
  const [ratingState, setRatingState] = useState<RatingState>({ hasRated, userRate: 0 });
  const [optimisticRating, updateOptimisticRating] = useOptimistic(ratingState, ratingReducer);
  const [isPending, startTransition] = useTransition();
  const { mutateAsync: updateProductUserRate } = useUpdateProductUserRate();

  if (optimisticRating.hasRated) {
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
    startTransition(async () => {
      const previous = ratingState;
      updateOptimisticRating({ type: 'submit', userRate });

      const result = await updateProductUserRate({ id: productId, userRate });
      if (!result.isSuccess) {
        updateOptimisticRating({ type: 'revert', previous });
        globalErrorHandler(result);
        return;
      }

      const savedRating = { hasRated: true, userRate };
      setRatingState(savedRating);
      updateOptimisticRating({ type: 'save', userRate });
      toast.add({ type: 'success', title: result.message || 'امتیاز شما ثبت شد.' });
    });
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
            disabled={isPending}
          />
          <Button
            type="submit"
            size="sm"
            variant="tonal"
            className="tw:self-start"
            isLoading={formState.isSubmitting || isPending}
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
