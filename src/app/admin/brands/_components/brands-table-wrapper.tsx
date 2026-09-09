import { Suspense } from 'react';
import { getAllBrandsAction } from '@/entities/brands/brands.actions';
import { BrandsTable } from './brands-table';
import { BrandsTableContainer } from './brands-table-container';
import { brandsTableSkeletonData } from './brands-table-skeleton-data';
export function BrandsTableWrapper() {
  const brandsPromise = getAllBrandsAction({ includeDisabled: true });
  return (
    <Suspense fallback={<BrandsTable brands={brandsTableSkeletonData} isSkeleton />}>
      <BrandsTableContainer brandsPromise={brandsPromise} />
    </Suspense>
  );
}
