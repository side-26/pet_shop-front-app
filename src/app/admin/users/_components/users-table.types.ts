import type { UserRole } from '@/configs/user-role';

export type UserTableRow = {
  id: string;
  fullName: string;
  phoneNumber: string;
  nationalCode: string;
  role: UserRole;
  isEnable: boolean;
};

export type UsersPageViewModel = {
  users: UserTableRow[];
  page: number;
  pageCount: number;
  total: number;
};
