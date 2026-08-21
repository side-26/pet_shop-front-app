import type {
  LoginUserInput,
  RegisterUserInput,
  ResetPasswordInput,
  SendOtpInput,
  VerifyResetPasswordOtpInput,
} from './auth.schema';

export type RegisterUserDTO = RegisterUserInput;

export type LoginUserDTO = Pick<LoginUserInput, 'phoneNumber' | 'password'>;

export type SendOtpDTO = SendOtpInput;

export type VerifyResetPasswordOtpDTO = VerifyResetPasswordOtpInput;

export type ResetPasswordDTO = ResetPasswordInput;

export type SendOtpResponseDTO = {
  remainingSeconds: number;
};

export type VerifyResetPasswordOtpResponseDTO = {
  temporaryToken: string;
  expiry: number;
};

export type LoginUserResponseDTO = {
  accessToken: string;
  refreshToken: string;
  sessionExp: number;
  userId: string;
  role: string;
  accessExp: number;
};
