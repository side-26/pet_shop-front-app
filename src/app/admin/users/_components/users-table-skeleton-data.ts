import { USER_ROLES } from '@/configs/user-role';

import type { UserTableRow } from './users-table.types';

export const usersTableSkeletonData: UserTableRow[] = Array.from({ length: 5 }, (_, index) => ({
  id: `skeleton-user-${index + 1}`,
  fullName: 'نام و نام خانوادگی کاربر',
  phoneNumber: '09123456789',
  nationalCode: '0012345678',
  role: USER_ROLES.CUSTOMER,
  isEnable: false,
}));
