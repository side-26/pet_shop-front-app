export interface AuthSessionModel {
  refreshToken: string;
  sessionExp: number;
  userId: string;
  role: string;
  accessToken: string;
  accessExp: number;
}
