import { Suspense } from 'react';

import { UsersPaginateTable } from './users-paginate-table';
import { usersTableSkeletonData } from './users-table.mock';
import { UsersTableWrapper } from './users-table-wrapper';

type UsersPageContentWrapperProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function UsersPageContent({ searchParams }: UsersPageContentWrapperProps) {
  const query = await searchParams;
  const requestedPage = Number(Array.isArray(query.page) ? query.page[0] : query.page);
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  return <UsersTableWrapper page={page} />;
}

export function UsersPageContentWrapper({ searchParams }: UsersPageContentWrapperProps) {
  return (
    <Suspense
      fallback={
        <UsersPaginateTable
          users={usersTableSkeletonData}
          page={1}
          pageCount={1}
          total={usersTableSkeletonData.length}
          isLoading
        />
      }
    >
      <UsersPageContent searchParams={searchParams} />
    </Suspense>
  );
}
