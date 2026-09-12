import { PawPrint } from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import type { CustomerPetDetailDTO } from '@/entities/pets/pets.dto';
import { cn } from '@/lib/utils';

import { PetCard, type PetCardViewModel } from './pet-card';

type PetGridProps = Readonly<{ isSkeleton?: boolean; pets: readonly PetCardViewModel[] }>;

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
        'tw:grid tw:grid-cols-1 tw:gap-4 tw:md:grid-cols-3 tw:xl:grid-cols-4 tw:xl:gap-5',
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      {pets.map((pet, index) => (
        <PetCard key={pet.id} pet={pet} eager={index === 0} isSkeleton={isSkeleton} />
      ))}
    </div>
  );
}

function relationTitle(relation: CustomerPetDetailDTO['petType']) {
  return typeof relation === 'string' ? relation : relation.title;
}

export function toPetCardViewModel(pet: CustomerPetDetailDTO): PetCardViewModel {
  return {
    available: pet.inEnable && pet.quantity > 0,
    breed: relationTitle(pet.breed),
    discountPercentage: pet.discountPercentage,
    id: pet.id,
    image: pet.mainImage,
    imageThumbnail: pet.mainImageThumbnail,
    petType: relationTitle(pet.petType),
    price: pet.price,
    slug: pet.slug,
    title: pet.title,
  };
}

export const petGridSkeletonData: readonly PetCardViewModel[] = Array.from(
  { length: 8 },
  (_, index) => ({
    available: true,
    breed: 'نژاد نمونه',
    discountPercentage: 0,
    id: `pet-skeleton-${index}`,
    image: '',
    imageThumbnail: '',
    petType: 'نوع حیوان',
    price: 100_000,
    slug: 'pet-skeleton',
    title: 'عنوان نمونه حیوان',
  }),
);
