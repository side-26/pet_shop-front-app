import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';

import { UsersPaginateTable } from './users-paginate-table';
import type { UsersPageResult } from './users-table.types';

type UsersTableContainerProps = {
  usersPromise: Promise<UsersPageResult>;
};

export async function UsersTableContainer({ usersPromise }: UsersTableContainerProps) {
  const result = await usersPromise;

  if (!result.isSuccess) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>دریافت کاربران انجام نشد</EmptyTitle>
          <EmptyDescription>{result.message}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (result.data.users.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>کاربری پیدا نشد</EmptyTitle>
          <EmptyDescription>هنوز کاربری مطابق این صفحه وجود ندارد.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return <UsersPaginateTable {...result.data} />;
}
