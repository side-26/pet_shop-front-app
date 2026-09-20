import { Suspense } from 'react';

import {
  normalizePaginationSearchParams,
  type PaginationSearchParams,
} from '@/entities/pagination/pagination.helpers';
import { getLandingPetListAction } from '@/entities/landing/landing.actions';

import { PetListBreadcrumb } from './pet-list-breadcrumb';
import { PetListContainer } from './pet-list-container';
import { PetListErrorBoundary } from './pet-list-error-boundary';
import { PetListRenderer } from './pet-list-renderer';

type PetListContentProps = Readonly<{ searchParams: Promise<PaginationSearchParams> }>;

export function PetListContent({ searchParams }: PetListContentProps) {
  return (
    <main className="tw:default-layout-container tw:flex tw:flex-col tw:gap-5 tw:py-3.5 tw:md:gap-6 tw:lg:[--pagination-sidebar-offset:15.6625rem]">
      <PetListBreadcrumb />
      <header className="tw:flex tw:flex-col tw:gap-2">
        <h1 className="tw:text-heading-2 tw:lg:text-heading-1">لیست حیوانات</h1>
      </header>
      <Suspense fallback={<PetListRenderer query={{}} isSkeleton />}>
        <PetListErrorBoundary>
          <PetListQueryContent searchParams={searchParams} />
        </PetListErrorBoundary>
      </Suspense>
    </main>
  );
}

async function PetListQueryContent({ searchParams }: PetListContentProps) {
  const {
    limit: _limit,
    page: _page,
    ...query
  } = normalizePaginationSearchParams(await searchParams);
  const petsPromise = getLandingPetListAction(query);
  const suspenseKey = new URLSearchParams(query).toString();

  return (
    <Suspense key={suspenseKey} fallback={<PetListRenderer query={query} isSkeleton />}>
      <PetListContainer petsPromise={petsPromise} query={query} />
    </Suspense>
  );
}
