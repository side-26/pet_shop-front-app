'use server';

import { redirect } from 'next/navigation';
import { ValidationError } from 'yup';

import { PATHS } from '@/configs/route.path';
import { validationErrorToFetcherError } from '@/entities/auth/auth.helpers';
import {
  loginUserSchema,
  registerUserSchema,
  sendOtpSchema,
  verifyResetPasswordOtpSchema,
  type LoginUserInput,
  type RegisterUserInput,
  type SendOtpInput,
  type VerifyResetPasswordOtpInput,
} from '@/entities/auth/auth.schema';
import {
  loginUser,
  registerUser,
  sendOtp,
  verifyResetPasswordOtp,
} from '@/entities/auth/auth.service';
import { saveSessionToCookie, saveTemporaryTokenToCookie } from '@/utils/session';

export async function registerUserAction(input: RegisterUserInput) {
  try {
    const validatedInput = await registerUserSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });

    return registerUser(validatedInput);
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return validationErrorToFetcherError(error);
    }

    throw error;
  }
}

export async function loginUserAction(input: LoginUserInput) {
  try {
    const validatedInput = await loginUserSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });
    const result = await loginUser({
      phoneNumber: validatedInput.phoneNumber,
      password: validatedInput.password,
    });

    if (!result.isSuccess) return result;

    await saveSessionToCookie(result.data);

    return {
      isSuccess: true as const,
      message: result.message,
      data: {},
    };
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return validationErrorToFetcherError(error);
    }

    throw error;
  }
}

export async function sendOtpAction(input: SendOtpInput) {
  try {
    const validatedInput = await sendOtpSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });

    return sendOtp(validatedInput);
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return validationErrorToFetcherError(error);
    }

    throw error;
  }
}

export async function verifyResetPasswordOtpAction(input: VerifyResetPasswordOtpInput) {
  try {
    const validatedInput = await verifyResetPasswordOtpSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });

    const result = await verifyResetPasswordOtp(validatedInput);

    if (!result.isSuccess) return result;

    await saveTemporaryTokenToCookie(result.data.temporaryToken);

    return {
      isSuccess: true as const,
      message: result.message,
      data: true as const,
    };
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return validationErrorToFetcherError(error);
    }

    throw error;
  }
}

export async function redirectToLoginAction(): Promise<never> {
  redirect(PATHS.AUTH.LOGIN);
}
