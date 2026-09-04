'use client';

import { useCallback, useRef, useTransition } from 'react';
import type { UseFormSetError } from 'react-hook-form';

import type { FormHandle } from '@/components/ui/form';
import { toast } from '@/components/ui/toast';
import { globalErrorHandler } from '@/utils/helpers';

import {
  changeCurrentUserPasswordAction,
  createUserAction,
  disableUserByIdAction,
  enableUserByIdAction,
  updateCurrentUserProfileAction,
} from './users.actions';
import type {
  ChangeCurrentUserPasswordInput,
  CreateUserInput,
  UpdateCurrentUserProfileInput,
} from './users.schema';

export async function submitCurrentUserProfile(
  input: UpdateCurrentUserProfileInput,
  showErrorFields: UseFormSetError<UpdateCurrentUserProfileInput>,
) {
  const result = await updateCurrentUserProfileAction(input);
  if (!result.isSuccess) {
    globalErrorHandler(result, { showErrorFields });
    return false;
  }

  toast.add({ type: 'success', title: result.message });
  return true;
}

export async function submitCurrentUserPassword(
  input: ChangeCurrentUserPasswordInput,
  showErrorFields: UseFormSetError<ChangeCurrentUserPasswordInput>,
) {
  const result = await changeCurrentUserPasswordAction(input);
  if (!result.isSuccess) {
    globalErrorHandler(result, { showErrorFields });
    return false;
  }

  toast.add({ type: 'success', title: result.message });
  return true;
}

export async function submitCreateUser(
  input: CreateUserInput,
  showErrorFields: UseFormSetError<CreateUserInput>,
): Promise<boolean> {
  const result = await createUserAction(input);

  if (!result.isSuccess) {
    globalErrorHandler(result, { showErrorFields });
    return false;
  }

  toast.add({ type: 'success', title: result.message });
  return true;
}

export function useCreateUser(onSuccess: () => void) {
  const formRef = useRef<FormHandle<CreateUserInput>>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = useCallback(
    (input: CreateUserInput) => {
      const form = formRef.current;
      if (!form || isPending) return;

      startTransition(async () => {
        const created = await submitCreateUser(input, form.setError);
        if (created) onSuccess();
      });
    },
    [isPending, onSuccess],
  );

  return { formRef, handleSubmit, isPending } as const;
}

export async function submitUserEnabledUpdate(id: string, isEnable: boolean): Promise<boolean> {
  const result = await (isEnable ? enableUserByIdAction : disableUserByIdAction)({ id });

  if (!result.isSuccess) {
    globalErrorHandler(result);
    return false;
  }

  toast.add({ type: 'success', title: result.message });
  return true;
}

export function useUserEnabledUpdate(onSuccess: () => void) {
  const [isPending, startTransition] = useTransition();

  const updateUserEnabled = useCallback(
    (id: string, isEnable: boolean) => {
      if (isPending) return;

      startTransition(async () => {
        if (await submitUserEnabledUpdate(id, isEnable)) onSuccess();
      });
    },
    [isPending, onSuccess],
  );

  return { isPending, updateUserEnabled } as const;
}
