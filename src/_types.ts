export interface AuthSessionModel {
  refreshToken: string;
  sessionExp: number;
  userId: number;
  accessToken: string;
  accessExp: number;
}
