import { USER_ROLES } from '@/configs/user-role';

import type { UserTableRow, UsersPageResult } from './users-table.types';

export const usersTableSkeletonData: UserTableRow[] = Array.from({ length: 5 }, (_, index) => ({
  id: `skeleton-user-${index + 1}`,
  fullName: 'نام و نام خانوادگی کاربر',
  phoneNumber: '09123456789',
  nationalCode: '0012345678',
  role: USER_ROLES.CUSTOMER,
  isEnable: false,
}));

const demoUsers: UserTableRow[] = [
  {
    id: 'user-1',
    fullName: 'مریم احمدی',
    phoneNumber: '09121234567',
    nationalCode: '0012345678',
    role: USER_ROLES.ADMIN,
    isEnable: true,
  },
  {
    id: 'user-2',
    fullName: 'علی رضایی',
    phoneNumber: '09192345678',
    nationalCode: '0456789123',
    role: USER_ROLES.SELLER,
    isEnable: true,
  },
  {
    id: 'user-3',
    fullName: 'سارا کریمی',
    phoneNumber: '09351234567',
    nationalCode: '1287654321',
    role: USER_ROLES.CUSTOMER,
    isEnable: false,
  },
  {
    id: 'user-4',
    fullName: 'رضا محمدی',
    phoneNumber: '09901234567',
    nationalCode: '3256789012',
    role: USER_ROLES.CUSTOMER,
    isEnable: true,
  },
  {
    id: 'user-5',
    fullName: 'نازنین اکبری',
    phoneNumber: '09211234567',
    nationalCode: '4423456789',
    role: USER_ROLES.SELLER,
    isEnable: true,
  },
];

export async function getMockUsersPage(page: number): Promise<UsersPageResult> {
  const pageCount = 4;
  const currentPage = Math.min(Math.max(1, page), pageCount);

  return {
    isSuccess: true,
    data: { users: demoUsers, page: currentPage, pageCount, total: 20 },
  };
}
