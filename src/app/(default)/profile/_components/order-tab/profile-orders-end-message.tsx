import { Button } from '@/components/ui/button';

type Props = Readonly<{
  errorMessage: string | null;
  hasNextPage: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}>;

export function ProfileOrdersEndMessage({
  errorMessage,
  hasNextPage,
  isLoading,
  onLoadMore,
}: Props) {
  if (!hasNextPage) return null;

  return (
    <div className="tw:flex tw:flex-col tw:items-center tw:gap-2 tw:pt-4">
      {errorMessage ? (
        <p role="alert" className="tw:text-body-s tw:text-error">
          {errorMessage}
        </p>
      ) : null}
      <Button
        color="primary"
        isLoading={isLoading}
        loadingText="در حال دریافت سفارش‌ها"
        onClick={onLoadMore}
        size="md"
        type="button"
        variant="text"
      >
        نمایش سفارش‌های بیشتر
      </Button>
    </div>
  );
}
