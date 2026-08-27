import { Suspense } from 'react';

import { UsersPaginateTable } from './users-paginate-table';
import { usersTableSkeletonData } from './users-table-skeleton-data';
import { UsersTableWrapper } from './users-table-wrapper';

type UsersPageContentWrapperProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const USERS_QUERY_KEYS = [
  'fullName',
  'role',
  'phoneNumber',
  'nationalCode',
  'page',
  'limit',
  'isEnable',
  'sort',
] as const;

async function UsersPageContent({ searchParams }: UsersPageContentWrapperProps) {
  const query = await searchParams;
  const requestQuery = Object.fromEntries(
    USERS_QUERY_KEYS.flatMap((key) => {
      const value = Array.isArray(query[key]) ? query[key][0] : query[key];
      return value === undefined ? [] : [[key, value]];
    }),
  );
  const requestedPage = Number(requestQuery.page);
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  return <UsersTableWrapper page={page} query={requestQuery} />;
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
