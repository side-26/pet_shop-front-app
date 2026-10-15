import { PawPrint } from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { cn } from '@/lib/utils';

import { PetCard } from './pet-card';
import type { PetCardViewModel } from './pet-card.types';

type PetGridProps = Readonly<{
  isSkeleton?: boolean;
  pets: readonly PetCardViewModel[];
}>;

export const petGridClassName =
  'tw:grid tw:grid-cols-1 tw:gap-4 tw:md:grid-cols-3 tw:xl:grid-cols-4 tw:xl:gap-5';

export function PetGrid({ isSkeleton = false, pets }: PetGridProps) {
  if (!isSkeleton && pets.length === 0) {
    return (
      <Empty className="tw:border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <PawPrint aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>حیوانی پیدا نشد</EmptyTitle>
          <EmptyDescription>
            فیلترها یا مرتب‌سازی را تغییر دهید و دوباره تلاش کنید.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div
      data-testid="pets-grid"
      aria-busy={isSkeleton || undefined}
      className={cn(
        petGridClassName,
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      {pets.map((pet, index) => (
        <PetCard key={pet.id} pet={pet} eager={index === 0} isSkeleton={isSkeleton} />
      ))}
    </div>
  );
}
