import { describe, expect, it, vi } from 'vitest';

import { getAllPaginatedUsersAction } from '@/entities/users/users.actions';

import { UsersTableWrapper } from './users-table-wrapper';

vi.mock('@/entities/users/users.actions', () => ({
  getAllPaginatedUsersAction: vi.fn(() => new Promise(() => undefined)),
}));

const getAllPaginatedUsersActionMock = vi.mocked(getAllPaginatedUsersAction);

describe('UsersTableWrapper', () => {
  it('starts the users Server Action with every request-driving query value', () => {
    const query = {
      fullName: 'مریم',
      role: 'admin',
      page: '2',
      limit: '50',
      isEnable: 'true',
      sort: 'asc',
    };

    const boundary = UsersTableWrapper({ page: 2, query });

    expect(getAllPaginatedUsersActionMock).toHaveBeenCalledWith(query);
    expect(boundary.key).toBe(JSON.stringify(query));
  });
});
