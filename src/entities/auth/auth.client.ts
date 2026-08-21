'use client';

import type { UseFormSetError } from 'react-hook-form';
import { useCallback, useRef, useState } from 'react';

import type { FormHandle } from '@/components/ui/form';
import { toast } from '@/components/ui/toast';
import {
  loginUserAction,
  redirectToLoginAction,
  registerUserAction,
  sendOtpAction,
  verifyResetPasswordOtpAction,
} from '@/entities/auth/auth.actions';
import type { SendOtpResponseDTO } from '@/entities/auth/auth.dto';
import type {
  LoginUserInput,
  RegisterUserInput,
  SendOtpInput,
  VerifyOtpCodeInput,
  VerifyResetPasswordOtpInput,
} from '@/entities/auth/auth.schema';
import { globalErrorHandler } from '@/utils/helpers';
import { wait } from '@/utils/wait';

const SUCCESS_TOAST_DURATION_MS = 3_000;

export async function submitRegisterUser(
  input: RegisterUserInput,
  showErrorFields: UseFormSetError<RegisterUserInput>,
): Promise<void> {
  const result = await registerUserAction(input);

  if (!result.isSuccess) {
    globalErrorHandler(result, { showErrorFields });
    return;
  }

  toast.add({ type: 'success', title: result.message, timeout: SUCCESS_TOAST_DURATION_MS });

  await redirectToLoginAction();
}

export function useRegisterUser() {
  const formRef = useRef<FormHandle<RegisterUserInput>>(null);
  const handleSubmit = useCallback(async (input: RegisterUserInput) => {
    const form = formRef.current;
    if (!form) return;

    await submitRegisterUser(input, form.setError);
  }, []);

  return { formRef, handleSubmit } as const;
}

export async function submitLoginUser(
  input: LoginUserInput,
  showErrorFields: UseFormSetError<LoginUserInput>,
): Promise<void> {
  const result = await loginUserAction(input);

  if (!result.isSuccess) {
    globalErrorHandler(result, { showErrorFields });
    return;
  }

  toast.add({ type: 'success', title: result.message });
}

export function useLoginUser() {
  const formRef = useRef<FormHandle<LoginUserInput>>(null);
  const handleSubmit = useCallback(async (input: LoginUserInput) => {
    const form = formRef.current;
    if (!form) return;

    await submitLoginUser(input, form.setError);
  }, []);

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
