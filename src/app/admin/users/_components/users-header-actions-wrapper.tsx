import { Suspense } from 'react';

import { parseUsersFilterSearchParams, type SearchParams } from './users-filter.helpers';
import { UsersHeaderActions } from './users-header-actions';

type UsersHeaderActionsWrapperProps = {
  searchParams: Promise<SearchParams>;
};

async function UsersHeaderActionsContainer({ searchParams }: UsersHeaderActionsWrapperProps) {
  const initialValues = parseUsersFilterSearchParams(await searchParams);

  return <UsersHeaderActions initialValues={initialValues} />;
}

function UsersHeaderActionsWrapper({ searchParams }: UsersHeaderActionsWrapperProps) {
  return (
    <Suspense fallback={<UsersHeaderActions />}>
      <UsersHeaderActionsContainer searchParams={searchParams} />
    </Suspense>
  );
}

export { UsersHeaderActionsWrapper };
