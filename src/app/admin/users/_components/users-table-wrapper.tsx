import { Suspense } from 'react';

import { UsersPaginateTable } from './users-paginate-table';
import { getMockUsersPage, usersTableSkeletonData } from './users-table.mock';
import { UsersTableContainer } from './users-table-container';

type UsersTableWrapperProps = {
  page: number;
};

export function UsersTableWrapper({ page }: UsersTableWrapperProps) {
  const usersPromise = getMockUsersPage(page);

  return (
    <Suspense
      key={page}
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
