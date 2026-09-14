import { Button } from '@/components/ui/button';

type PetInfiniteListLoadErrorProps = Readonly<{
  description: string;
  isLoading: boolean;
  onRetry: () => void;
}>;

export function PetInfiniteListLoadError({
  description,
  isLoading,
  onRetry,
}: PetInfiniteListLoadErrorProps) {
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
