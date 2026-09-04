import { USER_ROLES } from '@/configs/user-role';
import type { CurrentUserDTO } from '@/entities/users/users.dto';

export const adminProfileSkeletonData: CurrentUserDTO = {
  userId: 'skeleton-current-user',
  firstName: 'کاربر',
  lastName: 'مدیریت',
  phoneNumber: '09120000000',
  role: USER_ROLES.ADMIN,
  avatar: '',
};
