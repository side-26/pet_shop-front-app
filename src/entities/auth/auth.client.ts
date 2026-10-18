'use client';

import { useMutation } from '@tanstack/react-query';
import type { UseFormSetError } from 'react-hook-form';
import { useCallback, useRef } from 'react';
import { useRouter } from '@/hooks/use-router';

import type { FormHandle } from '@/components/ui/form';
import { toast } from '@/components/ui/toast';
import { routePaths } from '@/configs/route.path';
import { internalFetcher } from '@/lib/api/internalFetcher';
import {
  loginUserAction,
  logoutUserAction,
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

    const result = await internalFetcher<AuthSessionResponse>({
      url: AUTH_SESSION_API_PATH,
      method: 'GET',
      signal,
    });

    if (!result.userId) {
      useAuthStore.getState().deleteUserIdentity();
      return null;
    }

    const currentUser = await internalFetcher<CurrentUserResponse>({
      url: CURRENT_USER_API_PATH,
      method: 'GET',
    });
    if (!currentUser.isSuccess) {
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

export async function logoutUser(navigate: (href: string) => void): Promise<void> {
  const result = await logoutUserAction();

  if (result && !result.isSuccess) {
    globalErrorHandler(result);
    return;
  }

  await syncUserIdentity();
  navigate(routePaths.loginAfterLogout);
}

export function useLogoutUser() {
  const router = useRouter();
  const { mutateAsync } = useMutation({
    mutationFn: () => logoutUser(router.replace),
    retry: false,
  });

  return useCallback(async () => {
    await mutateAsync();
  }, [mutateAsync]);
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
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (input: RegisterUserInput) => {
      const form = formRef.current;
      if (!form) return;

      await submitRegisterUser(input, form.setError, router.replace);
    },
    retry: false,
  });
  const handleSubmit = useCallback(
    async (input: RegisterUserInput) => {
      if (isPending) return;

      await mutateAsync(input);
    },
    [isPending, mutateAsync],
  );

  return { formRef, handleSubmit, isPending } as const;
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
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async ({ callbackUrl, input }: { callbackUrl?: string; input: LoginUserInput }) => {
      const form = formRef.current;
      if (!form) return;

      await submitLoginUser(input, form.setError, callbackUrl, router.replace);
    },
    retry: false,
  });
  const handleSubmit = useCallback(
    async (input: LoginUserInput) => {
      if (isPending) return;

      const callbackUrl =
        new URLSearchParams(window.location.search).get('callbackUrl') ?? undefined;
      await mutateAsync({ input, callbackUrl });
    },
    [isPending, mutateAsync],
  );

  return { formRef, handleSubmit, isPending } as const;
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
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (input: SendOtpInput) => {
      const form = formRef.current;
      return submitSendOtp(input, form?.setError);
    },
    retry: false,
  });
  const handleSubmit = useCallback(
    async (input: SendOtpInput) => {
      if (isPending) return;

      const response = await mutateAsync(input);
      if (response) onSuccess(input, response);
    },
    [isPending, mutateAsync, onSuccess],
  );

  return { formRef, handleSubmit, isPending } as const;
}

export function useResendOtp(
  phoneNumber: string,
  onSuccess: (response: SendOtpResponseDTO) => void,
) {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (input: SendOtpInput) => submitSendOtp(input),
    retry: false,
  });

  const handleResend = useCallback(async () => {
    if (isPending) return;

    const response = await mutateAsync({ phoneNumber });
    if (response) onSuccess(response);
  }, [isPending, mutateAsync, onSuccess, phoneNumber]);

  return { handleResend, isLoading: isPending } as const;
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
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (input: VerifyResetPasswordOtpInput) => {
      const form = formRef.current;
      if (!form) return null;

      return submitVerifyResetPasswordOtp(input, form.setError);
    },
    retry: false,
  });
  const handleSubmit = useCallback(
    async (input: VerifyOtpCodeInput) => {
      if (isPending) return;
      const verificationCode = input.verificationCode ?? completedCodeRef.current;
      if (!verificationCode) return;

      const isVerified = await mutateAsync({
        phoneNumber,
        'otp-code': verificationCode,
        'reset-password': true,
      });
      if (isVerified) onSuccess();
    },
    [isPending, mutateAsync, onSuccess, phoneNumber],
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

  return { formRef, handleFinished, handleSubmit, isPending, resetVerificationCode } as const;
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
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (input: ResetPasswordInput) => {
      const form = formRef.current;
      if (!form) return;

      await submitResetPassword(input, form.setError);
    },
    retry: false,
  });
  const handleSubmit = useCallback(
    async (input: ResetPasswordInput) => {
      if (isPending) return;

      await mutateAsync(input);
    },
    [isPending, mutateAsync],
  );

  return { formRef, handleSubmit, isPending } as const;
}
