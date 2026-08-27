import { Suspense } from 'react';

import { getAllPaginatedUsersAction } from '@/entities/users/users.actions';

import { UsersPaginateTable } from './users-paginate-table';
import { usersTableSkeletonData } from './users-table-skeleton-data';
import { UsersTableContainer } from './users-table-container';

type UsersTableWrapperProps = {
  page: number;
  query: Record<string, string>;
};

export function UsersTableWrapper({ page, query }: UsersTableWrapperProps) {
  const usersPromise = getAllPaginatedUsersAction(query);

  return (
    <Suspense
      key={JSON.stringify(query)}
      fallback={
        <UsersPaginateTable
          users={usersTableSkeletonData}
          page={page}
          pageCount={1}
          total={usersTableSkeletonData.length}
          isLoading
        />
      }
    >
      <UsersTableContainer usersPromise={usersPromise} />
    </Suspense>
  );
}
