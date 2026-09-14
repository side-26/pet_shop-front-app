import { Button } from '@/components/ui/button';

type ProductInfiniteListLoadErrorProps = Readonly<{
  description: string;
  isLoading: boolean;
  onRetry: () => void;
}>;

export function ProductInfiniteListLoadError({
  description,
  isLoading,
  onRetry,
}: ProductInfiniteListLoadErrorProps) {
  return (
    <div className="tw:flex tw:flex-col tw:items-center tw:gap-3 tw:py-4" role="alert">
      <p className="tw:text-body-s tw:text-error">{description}</p>
      <Button
        color="secondary"
        size="sm"
        variant="outlined"
        isLoading={isLoading}
        loadingText="در حال تلاش دوباره"
        onClick={onRetry}
      >
        تلاش دوباره
      </Button>
    </div>
  );
}
