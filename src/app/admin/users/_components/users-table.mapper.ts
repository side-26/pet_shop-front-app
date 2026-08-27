import type { AllPaginatedUsersDTO } from '@/entities/users/users.dto';

import type { UsersPageViewModel } from './users-table.types';

function normalizeTotal(totalItems: unknown, fallback: number): number {
  const total = Number(totalItems);
  return Number.isFinite(total) && total >= 0 ? total : fallback;
}

export function mapUsersPageViewModel(data: AllPaginatedUsersDTO): UsersPageViewModel {
  const users = data.result.map((user) => ({
    id: user._id,
    fullName: `${user.firstName} ${user.lastName}`.trim(),
    phoneNumber: user.phoneNumber,
    nationalCode: user.nationalCode,
    role: user.role,
    isEnable: user.isEnable,
  }));

  return {
    users,
    page: Math.max(1, data.pagination.currentPage),
    pageCount: Math.max(1, data.pagination.totalPages),
    total: normalizeTotal(data.pagination.totalItems, users.length),
  };
}
