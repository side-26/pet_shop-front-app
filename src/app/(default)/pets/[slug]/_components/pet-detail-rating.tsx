import { Star } from 'lucide-react';

type PetDetailRatingProps = Readonly<{
  rating: number;
  reviewCount: number;
}>;

export function PetDetailRating({ rating, reviewCount }: PetDetailRatingProps) {
  if (reviewCount < 1) return null;

  return (
    <div className="tw:col-span-3 tw:flex tw:items-center tw:gap-2 tw:text-label-m">
      <Star
        aria-hidden="true"
        className="tw:size-5 tw:fill-warning-active tw:text-warning-active"
      />
      <bdi>{rating}</bdi>
      <span className="tw:text-muted-foreground">({reviewCount} امتیاز)</span>
    </div>
  );
}
