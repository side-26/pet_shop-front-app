import 'server-only';

import type {
  LoginUserDTO,
  LoginUserResponseDTO,
  RefreshTokenDTO,
  RefreshTokenResponseDTO,
  RegisterUserDTO,
  ResetPasswordDTO,
  SendOtpDTO,
  SendOtpResponseDTO,
  VerifyResetPasswordOtpDTO,
  VerifyResetPasswordOtpResponseDTO,
} from '@/entities/auth/auth.dto';
import { customFetcher } from '@/lib/api/customFetcher';

export function registerUser(input: RegisterUserDTO) {
  return customFetcher<null, unknown, RegisterUserDTO>({
    url: '/users/register',
    method: 'POST',
    body: input,
    auth: false,
    cache: 'no-store',
  });
}

export function loginUser(input: LoginUserDTO) {
  return customFetcher<LoginUserResponseDTO, unknown, LoginUserDTO>({
    url: '/users/login',
    method: 'POST',
    body: input,
    auth: false,
    cache: 'no-store',
  });
}

export function refreshAccessToken(input: RefreshTokenDTO) {
  return customFetcher<RefreshTokenResponseDTO, unknown, RefreshTokenDTO>({
    url: '/users/refresh-token',
    method: 'POST',
    body: input,
    auth: false,
    cache: 'no-store',
  });
}

export function sendOtp(input: SendOtpDTO) {
  return customFetcher<SendOtpResponseDTO, unknown, SendOtpDTO>({
    url: '/users/send-otp',
    method: 'POST',
    body: input,
    auth: false,
    cache: 'no-store',
  });
}

export function verifyResetPasswordOtp(input: VerifyResetPasswordOtpDTO) {
  return customFetcher<VerifyResetPasswordOtpResponseDTO, unknown, VerifyResetPasswordOtpDTO>({
    url: '/users/verify',
    method: 'POST',
    body: input,
    auth: false,
    cache: 'no-store',
  });
}

export function resetPassword(input: ResetPasswordDTO, temporaryToken: string) {
  return customFetcher<true, unknown, ResetPasswordDTO>(
    {
      url: '/users/reset-password',
      method: 'POST',
      body: input,
      auth: false,
      cache: 'no-store',
    },
    { customToken: temporaryToken },
  );
}
