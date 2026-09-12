import { Suspense } from 'react';

import {
  normalizePaginationSearchParams,
  type PaginationSearchParams,
} from '@/entities/pagination/pagination.helpers';
import { getCustomerPetsPage } from '@/entities/pets/pets.service';

import { PetListBreadcrumb } from './pet-list-breadcrumb';
import { PetListContainer } from './pet-list-container';
import { PetListRenderer } from './pet-list-renderer';

type PetListContentProps = Readonly<{ searchParams: Promise<PaginationSearchParams> }>;

export function PetListContent({ searchParams }: PetListContentProps) {
  return (
    <main className="tw:mx-auto tw:flex tw:w-full tw:max-w-7xl tw:flex-col tw:gap-5 tw:px-3 tw:py-5 tw:sm:px-5 tw:md:gap-6 tw:md:px-6 tw:md:py-8 tw:lg:px-8 tw:lg:py-10">
      <PetListBreadcrumb />
      <header className="tw:flex tw:flex-col tw:gap-2">
        <h1 className="tw:text-heading-2 tw:lg:text-heading-1">حیوانات دوست‌داشتنی</h1>
        <p className="tw:max-w-2xl tw:text-body-m tw:text-muted-foreground">
          همراه تازه خانواده‌تان را از میان حیوانات سالم و آماده واگذاری پیدا کنید.
        </p>
      </header>
      <Suspense fallback={<PetListRenderer query={{}} isSkeleton />}>
        <PetListQueryContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function PetListQueryContent({ searchParams }: PetListContentProps) {
  const query = normalizePaginationSearchParams(await searchParams);
  const petsPromise = getCustomerPetsPage(query);
  const suspenseKey = new URLSearchParams(query).toString();

  return (
    <Suspense key={suspenseKey} fallback={<PetListRenderer query={query} isSkeleton />}>
      <PetListContainer petsPromise={petsPromise} query={query} />
    </Suspense>
  );
}
