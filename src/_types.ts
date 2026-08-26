import type { UserRole } from '@/configs/user-role';

export interface AuthSessionModel {
  refreshToken: string;
  sessionExp: number;
  userId: string;
  role: UserRole;
  accessToken: string;
  accessExp: number;
}
