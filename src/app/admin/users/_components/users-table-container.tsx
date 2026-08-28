import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import type { getAllPaginatedUsersAction } from '@/entities/users/users.actions';

import { UsersPaginateTable } from './users-paginate-table';
import { mapUsersPageViewModel } from './users-table.mapper';

type UsersTableContainerProps = {
  usersPromise: ReturnType<typeof getAllPaginatedUsersAction>;
  query: Record<string, string>;
};

export async function UsersTableContainer({ usersPromise, query }: UsersTableContainerProps) {
  const result = await usersPromise;

  if (!result.isSuccess) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>دریافت کاربران انجام نشد</EmptyTitle>
          <EmptyDescription>{result.message ?? 'خطایی در دریافت کاربران رخ داد.'}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const usersPage = mapUsersPageViewModel(result.data);

  return <UsersPaginateTable {...usersPage} query={query} />;
}
