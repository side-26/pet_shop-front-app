import { PaginationLayout } from '@/components/common/pagination-layout/pagination-layout';
import {
  paginationLayoutSkeletonFilters,
  paginationLayoutSkeletonPagination,
  paginationLayoutSkeletonSort,
} from '@/components/common/pagination-layout/pagination-layout-skeleton-data';
import { routePaths } from '@/configs/route.path';
import type { CustomerPetDetailsPageDTO } from '@/entities/pets/pets.dto';

import { PetGrid, petGridSkeletonData, toPetCardViewModel } from './pet-grid';

type PetListRendererProps = Readonly<{
  data?: CustomerPetDetailsPageDTO;
  isSkeleton?: boolean;
  query: Readonly<Record<string, string>>;
}>;

export function PetListRenderer({ data, isSkeleton = false, query }: PetListRendererProps) {
  const pets = isSkeleton ? petGridSkeletonData : (data?.result ?? []).map(toPetCardViewModel);

  return (
    <PaginationLayout
      basePath={routePaths.petsList}
      filterLabel="فیلتر حیوانات"
      filters={isSkeleton ? paginationLayoutSkeletonFilters : data?.filters}
      isSkeleton={isSkeleton}
      itemCount={pets.length}
      itemLabel="حیوان"
      pagination={
        isSkeleton
          ? paginationLayoutSkeletonPagination
          : (data?.pagination ?? paginationLayoutSkeletonPagination)
      }
      query={query}
      sort={isSkeleton ? paginationLayoutSkeletonSort : data?.sort}
    >
      <h2 className="tw:sr-only">فهرست حیوانات</h2>
      <PetGrid pets={pets} isSkeleton={isSkeleton} />
    </PaginationLayout>
  );
}
