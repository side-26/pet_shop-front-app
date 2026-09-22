'use client';

import type { UseFormSetError } from 'react-hook-form';
import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'nextjs-toploader/app';

import type { FormHandle } from '@/components/ui/form';
import { toast } from '@/components/ui/toast';
import { routePaths } from '@/configs/route.path';
import {
  loginUserAction,
  logoutUserAction,
  redirectToLoginAfterLogoutAction,
  redirectToLoginAction,
  registerUserAction,
  resetPasswordAction,
  sendOtpAction,
  verifyResetPasswordOtpAction,
} from '@/entities/auth/auth.actions';
import type { SendOtpResponseDTO } from '@/entities/auth/auth.dto';
import { resolveLoginRedirectPath } from '@/entities/auth/auth.helpers';
import { useAuthStore } from '@/entities/auth/auth.store';
import type {
  LoginUserInput,
  RegisterUserInput,
  ResetPasswordInput,
  SendOtpInput,
  VerifyOtpCodeInput,
  VerifyResetPasswordOtpInput,
} from '@/entities/auth/auth.schema';
import { globalErrorHandler } from '@/utils/helpers';
import { wait } from '@/utils/wait';
import type { CurrentUserDTO } from '@/entities/users/users.dto';

const SUCCESS_TOAST_DURATION_MS = 3_000;
const AUTH_SESSION_API_PATH = '/api/auth/session';
const CURRENT_USER_API_PATH = '/api/users/current';

type AuthSessionResponse = {
  userId: string | null;
};
type CurrentUserResponse =
  { isSuccess: true; data: CurrentUserDTO } | { isSuccess: false; data: unknown };

export async function syncUserIdentity(signal?: AbortSignal): Promise<CurrentUserDTO | null> {
  try {
    if (signal?.aborted) return null;

    const response = await fetch(AUTH_SESSION_API_PATH, {
      method: 'GET',
      cache: 'no-store',
      credentials: 'same-origin',
      signal,
    });
    const result = (await response.json()) as AuthSessionResponse;

    if (!response.ok || !result.userId) {
      useAuthStore.getState().deleteUserIdentity();
      return null;
    }

    const currentUserResponse = await fetch(CURRENT_USER_API_PATH, {
      method: 'GET',
      cache: 'no-store',
      credentials: 'same-origin',
    });
    const currentUser = (await currentUserResponse.json()) as CurrentUserResponse;
    if (!currentUserResponse.ok || !currentUser.isSuccess) {
      useAuthStore.getState().deleteUserIdentity();
      return null;
    }

    const store = useAuthStore.getState();
    if (store.userIdentity) store.updateUserIdentity(currentUser.data);
    else store.saveUserIdentity(currentUser.data);

    return currentUser.data;
  } catch {
    if (signal?.aborted) return null;
    useAuthStore.getState().deleteUserIdentity();
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  const result = await logoutUserAction();

  if (result && !result.isSuccess) {
    globalErrorHandler(result);
    return;
  }

  await syncUserIdentity();
  await redirectToLoginAfterLogoutAction();
}

export async function submitRegisterUser(
  input: RegisterUserInput,
  showErrorFields: UseFormSetError<RegisterUserInput>,
  navigate: (href: string) => void,
): Promise<void> {
  const result = await registerUserAction(input);

  if (!result.isSuccess) {
    globalErrorHandler(result, { showErrorFields });
    return;
  }

  toast.add({ type: 'success', title: result.message, timeout: SUCCESS_TOAST_DURATION_MS });

  navigate(routePaths.login);
}

export function useRegisterUser() {
  const formRef = useRef<FormHandle<RegisterUserInput>>(null);
  const router = useRouter();
  const handleSubmit = useCallback(
    async (input: RegisterUserInput) => {
      const form = formRef.current;
      if (!form) return;

      await submitRegisterUser(input, form.setError, router.replace);
    },
    [router],
  );

  return { formRef, handleSubmit } as const;
}

export async function submitLoginUser(
  input: LoginUserInput,
  showErrorFields: UseFormSetError<LoginUserInput>,
  callbackUrl: string | undefined,
  navigate: (href: string) => void,
): Promise<void> {
  const result = await loginUserAction(input);

  if (!result.isSuccess) {
    globalErrorHandler(result, { showErrorFields });
    return;
  }

  toast.add({ type: 'success', title: result.message });
  await syncUserIdentity();
  navigate(resolveLoginRedirectPath(callbackUrl, result.data.role));
}

export function useLoginUser() {
  const formRef = useRef<FormHandle<LoginUserInput>>(null);
  const router = useRouter();
  const handleSubmit = useCallback(
    async (input: LoginUserInput) => {
      const form = formRef.current;
      if (!form) return;

      const callbackUrl =
        new URLSearchParams(window.location.search).get('callbackUrl') ?? undefined;
      await submitLoginUser(input, form.setError, callbackUrl, router.replace);
    },
    [router],
  );

  return { formRef, handleSubmit } as const;
}

export async function submitSendOtp(
  input: SendOtpInput,
  showErrorFields?: UseFormSetError<SendOtpInput>,
): Promise<SendOtpResponseDTO | null> {
  const result = await sendOtpAction(input);

  if (!result.isSuccess) {
    if (showErrorFields) {
      globalErrorHandler(result, { showErrorFields });
    } else {
      globalErrorHandler(result);
    }
    return null;
  }

  toast.add({ type: 'success', title: result.message });

  return result.data;
}

type SendOtpSuccessHandler = (input: SendOtpInput, response: SendOtpResponseDTO) => void;

export function useSendOtp(onSuccess: SendOtpSuccessHandler) {
  const formRef = useRef<FormHandle<SendOtpInput>>(null);
  const handleSubmit = useCallback(
    async (input: SendOtpInput) => {
      const form = formRef.current;
      if (!form) return;

      const response = await submitSendOtp(input, form.setError);
      if (response) onSuccess(input, response);
    },
    [onSuccess],
  );

  return { formRef, handleSubmit } as const;
}

export function useResendOtp(
  phoneNumber: string,
  onSuccess: (response: SendOtpResponseDTO) => void,
) {
  const [isLoading, setIsLoading] = useState(false);

  const handleResend = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await submitSendOtp({ phoneNumber });
      if (response) onSuccess(response);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, onSuccess, phoneNumber]);

  return { handleResend, isLoading } as const;
}

export async function submitVerifyResetPasswordOtp(
  input: VerifyResetPasswordOtpInput,
  showErrorFields: UseFormSetError<VerifyOtpCodeInput>,
): Promise<true | null> {
  const result = await verifyResetPasswordOtpAction(input);

  if (!result.isSuccess) {
    globalErrorHandler(result, { showErrorFields });
    return null;
  }

  toast.add({ type: 'success', title: result.message });

  return result.data;
}

type VerifyResetPasswordOtpSuccessHandler = () => void;

export function useVerifyResetPasswordOtp(
  phoneNumber: string,
  onSuccess: VerifyResetPasswordOtpSuccessHandler,
) {
  const formRef = useRef<FormHandle<VerifyOtpCodeInput>>(null);
  const completedCodeRef = useRef('');
  const handleSubmit = useCallback(
    async (input: VerifyOtpCodeInput) => {
      const form = formRef.current;
      if (!form) return;
      const verificationCode = input.verificationCode ?? completedCodeRef.current;
      if (!verificationCode) return;

      const isVerified = await submitVerifyResetPasswordOtp(
        {
          phoneNumber,
          'otp-code': verificationCode,
          'reset-password': true,
        },
        form.setError,
      );
      if (isVerified) onSuccess();
    },
    [onSuccess, phoneNumber],
  );
  const handleFinished = useCallback(
    (verificationCode: string) => {
      const form = formRef.current;
      if (!form) return;

      completedCodeRef.current = verificationCode;
      form.setValue('verificationCode', verificationCode, {
        shouldDirty: true,
        shouldTouch: true,
      });
      void form.handleSubmit(handleSubmit)();
    },
    [handleSubmit],
  );
  const resetVerificationCode = useCallback(() => {
    completedCodeRef.current = '';
    formRef.current?.reset({ verificationCode: '' });
  }, []);

  return { formRef, handleFinished, handleSubmit, resetVerificationCode } as const;
}

export async function submitResetPassword(
  input: ResetPasswordInput,
  showErrorFields: UseFormSetError<ResetPasswordInput>,
): Promise<void> {
  const result = await resetPasswordAction(input);

  if (!result.isSuccess) {
    globalErrorHandler(result, { showErrorFields });
    if ('shouldRedirectToLogin' in result && result.shouldRedirectToLogin) {
      await redirectToLoginAction();
    }
    return;
  }

  toast.add({ type: 'success', title: result.message });
  await redirectToLoginAction();
}

export function useResetPassword() {
  const formRef = useRef<FormHandle<ResetPasswordInput>>(null);
  const handleSubmit = useCallback(async (input: ResetPasswordInput) => {
    const form = formRef.current;
    if (!form) return;

    await submitResetPassword(input, form.setError);
  }, []);

  return { formRef, handleSubmit } as const;
}
