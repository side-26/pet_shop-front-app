import { cn } from '@/lib/utils';

import { PetCard } from './pet-card';
import { petGridClassName, petGridSkeletonData } from './pet-grid';

const twoRowVisibility = [
  '',
  '',
  'tw:hidden tw:md:block',
  'tw:hidden tw:md:block',
  'tw:hidden tw:md:block',
  'tw:hidden tw:md:block',
  'tw:hidden tw:xl:block',
  'tw:hidden tw:xl:block',
] as const;

/** Reserves exactly two rows of the current responsive pet-card grid while appending. */
export function PetInfiniteListLoader() {
  return (
    <div
      aria-busy="true"
      aria-label="در حال دریافت حیوانات بیشتر"
      className={cn(petGridClassName, 'skeleton tw:pointer-events-none tw:select-none')}
    >
      {petGridSkeletonData.map((pet, index) => (
        <div key={pet.id} className={twoRowVisibility[index]}>
          <PetCard pet={pet} isSkeleton />
        </div>
      ))}
    </div>
  );
}
