import type { LoginUserInput, RegisterUserInput, SendOtpInput } from './auth.schema';

export type RegisterUserDTO = RegisterUserInput;

export type LoginUserDTO = Pick<LoginUserInput, 'phoneNumber' | 'password'>;

export type SendOtpDTO = SendOtpInput;

export type SendOtpResponseDTO = {
  remainingSeconds: number;
};

export type LoginUserResponseDTO = {
  accessToken: string;
  refreshToken: string;
  sessionExp: number;
  userId: string;
  role: string;
  accessExp: number;
};
