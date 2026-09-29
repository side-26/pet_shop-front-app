'use client';

import { useCallback, useRef, useTransition } from 'react';
import type { UseFormSetError } from 'react-hook-form';

import type { FormHandle } from '@/components/ui/form';
import { toast } from '@/components/ui/toast';
import type { FetcherResult } from '@/lib/api/customFetcher';
import { globalErrorHandler } from '@/utils/helpers';

import {
  createDeliveryServiceAction,
  deleteDeliveryServiceAction,
  disableDeliveryServiceAction,
  enableDeliveryServiceAction,
  updateDeliveryServiceAction,
} from './delivery-services.actions';
import type { DeliveryServiceInput, UpdateDeliveryServiceInput } from './delivery-services.schema';

export async function submitCreateDeliveryService(
  input: DeliveryServiceInput,
  showErrorFields: UseFormSetError<DeliveryServiceInput>,
) {
  const result = await createDeliveryServiceAction(input);
  if (!result.isSuccess) {
    globalErrorHandler(result, { showErrorFields });
    return false;
  }
  toast.add({ type: 'success', title: result.message });
  return true;
}

export async function submitUpdateDeliveryService(
  id: string,
  input: UpdateDeliveryServiceInput,
  showErrorFields: UseFormSetError<UpdateDeliveryServiceInput>,
) {
  const result = await updateDeliveryServiceAction({ id, ...input });
  if (!result.isSuccess) {
    globalErrorHandler(result, { showErrorFields });
    return false;
  }
  toast.add({ type: 'success', title: result.message });
  return true;
}

async function submitById<T>(id: string, action: (input: unknown) => Promise<FetcherResult<T>>) {
  const result = await action({ id });
  if (!result.isSuccess) {
    globalErrorHandler(result);
    return false;
  }
  toast.add({ type: 'success', title: result.message });
  return true;
}

export const submitDeliveryServiceEnabledUpdate = (id: string, enabled: boolean) =>
  submitById(id, enabled ? enableDeliveryServiceAction : disableDeliveryServiceAction);
export const submitDeleteDeliveryService = (id: string) =>
  submitById(id, deleteDeliveryServiceAction);

export function useCreateDeliveryService(onSuccess: () => void) {
  const formRef = useRef<FormHandle<DeliveryServiceInput>>(null);
  const [isPending, startTransition] = useTransition();
  const handleSubmit = useCallback(
    (input: DeliveryServiceInput) => {
      const form = formRef.current;
      if (!form || isPending) return;
      startTransition(async () => {
        if (await submitCreateDeliveryService(input, form.setError)) onSuccess();
      });
    },
    [isPending, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useUpdateDeliveryService(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<UpdateDeliveryServiceInput>>(null);
  const [isPending, startTransition] = useTransition();
  const handleSubmit = useCallback(
    (input: UpdateDeliveryServiceInput) => {
      const form = formRef.current;
      if (!form || isPending) return;
      startTransition(async () => {
        if (await submitUpdateDeliveryService(id, input, form.setError)) onSuccess();
      });
    },
    [id, isPending, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useDeliveryServiceStatus(onSuccess: () => void) {
  const [isPending, startTransition] = useTransition();
  const update = useCallback(
    (id: string, enabled: boolean) => {
      if (isPending) return;
      startTransition(async () => {
        if (await submitDeliveryServiceEnabledUpdate(id, enabled)) onSuccess();
      });
    },
    [isPending, onSuccess],
  );
  return { isPending, update } as const;
}
