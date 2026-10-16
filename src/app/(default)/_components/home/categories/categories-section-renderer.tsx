import {
  AnimatedStaggeredList,
  animatedStaggeredListItemClassName,
} from '@/components/common/staggered-list';
import { PetTypesCarouselSection } from '@/components/common/pet-types-carousel-section';
import type { LandingPetTypeDTO } from '@/entities/landing/landing.dto';

type CategoriesSectionRendererProps = Readonly<{
  petTypes: readonly LandingPetTypeDTO[];
  isSkeleton?: boolean;
}>;

export function CategoriesSectionRenderer({
  petTypes,
  isSkeleton = false,
}: CategoriesSectionRendererProps) {
  return (
    <AnimatedStaggeredList aria-busy={isSkeleton || undefined}>
      <PetTypesCarouselSection
        petTypes={petTypes}
        isLoading={isSkeleton}
        itemClassName={animatedStaggeredListItemClassName}
      />
    </AnimatedStaggeredList>
  );
}
