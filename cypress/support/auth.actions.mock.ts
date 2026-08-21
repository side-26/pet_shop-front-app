import type {
  LoginUserInput,
  RegisterUserInput,
  SendOtpInput,
  VerifyResetPasswordOtpInput,
} from '@/entities/auth/auth.schema';

export async function registerUserAction(_input: RegisterUserInput) {
  return {
    isSuccess: true as const,
    message: 'ثبت‌نام با موفقیت انجام شد.',
    data: null,
  };
}

export async function loginUserAction(_input: LoginUserInput) {
  return {
    isSuccess: true as const,
    message: 'ورود با موفقیت انجام شد.',
    data: {},
  };
}

export async function sendOtpAction(_input: SendOtpInput) {
  return {
    isSuccess: true as const,
    message: 'کد تأیید با موفقیت ارسال شد.',
    data: { remainingSeconds: 1 },
  };
}

export async function verifyResetPasswordOtpAction(_input: VerifyResetPasswordOtpInput) {
  return {
    isSuccess: true as const,
    message: 'کد تأیید شما معتبر است',
    data: true as const,
  };
}

export async function redirectToLoginAction(): Promise<void> {}
