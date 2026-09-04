import { USER_ROLES } from '@/configs/user-role';
import type { CurrentUserDTO } from '@/entities/users/users.dto';

export const adminCurrentUserSkeletonData: CurrentUserDTO = {
  userId: 'skeleton-current-user',
  firstName: 'کاربر',
  lastName: 'مدیریت',
  phoneNumber: '00000000000',
  role: USER_ROLES.ADMIN,
  avatar: '',
};
