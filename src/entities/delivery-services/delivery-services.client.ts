'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';

import type { FormHandle } from '@/components/ui/form';
import { toast } from '@/components/ui/toast';
import type { FetcherError, FetcherResult } from '@/lib/api/customFetcher';
import { globalErrorHandler } from '@/utils/helpers';

import {
  createDeliveryServiceAction,
  deleteDeliveryServiceAction,
  disableDeliveryServiceAction,
  enableDeliveryServiceAction,
  getAvailableDeliveryServicesAction,
  updateDeliveryServiceAction,
} from './delivery-services.actions';
import type {
  AvailableDeliveryServicesQueryInput,
  DeliveryServiceInput,
  UpdateDeliveryServiceInput,
} from './delivery-services.schema';

export const deliveryServicesQueryKeys = {
  available: (input: AvailableDeliveryServicesQueryInput) =>
    ['delivery-services', 'available', input.lat, input.lng] as const,
  availablePrefix: ['delivery-services', 'available'] as const,
};

export class AvailableDeliveryServicesQueryError extends Error {
  constructor(message: string | null) {
    super(message ?? 'دریافت سرویس‌های ارسال انجام نشد.');
    this.name = 'AvailableDeliveryServicesQueryError';
  }
}

/** Client-side checkout reads stay behind the entity boundary rather than calling a Server Action in UI. */
export function getAvailableDeliveryServices(input: AvailableDeliveryServicesQueryInput) {
  return getAvailableDeliveryServicesAction(input);
}

/**
 * Quotes are intentionally ephemeral: they are stale immediately and discarded when unused.
 * The Server Action remains the only client-to-server transport boundary.
 */
export function useAvailableDeliveryServices(input: AvailableDeliveryServicesQueryInput | null) {
  return useQuery({
    queryKey: input
      ? deliveryServicesQueryKeys.available(input)
      : (['delivery-services', 'available', 'unselected-address'] as const),
    queryFn: async () => {
      if (!input) return [];
      const result = await getAvailableDeliveryServices(input);
      if (!result.isSuccess) throw new AvailableDeliveryServicesQueryError(result.message);
      return result.data;
    },
    enabled: input !== null,
    staleTime: 0,
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

type DeliveryServiceMutationAction<TVariables> = (
  input: TVariables,
) => Promise<FetcherResult<unknown>>;
type DeliveryServiceMutationOptions = {
  onError?: (error: FetcherError) => void;
};

/** Server reads refresh through EntityTags; checkout quotes refresh through this client query prefix. */
function useDeliveryServiceMutation<TVariables>(
  action: DeliveryServiceMutationAction<TVariables>,
  { onError = globalErrorHandler }: DeliveryServiceMutationOptions = {},
) {
  const queryClient = useQueryClient();
  return useMutation<FetcherResult<unknown>, FetcherError, TVariables>({
    mutationFn: async (variables) => {
      const result = await action(variables);
      if (!result.isSuccess) throw result;
      return result;
    },
    retry: false,
    onError: (error) => onError(error),
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: deliveryServicesQueryKeys.availablePrefix });
      toast.add({ type: 'success', title: result.message });
    },
  });
}

export function useCreateDeliveryServiceMutation(options?: DeliveryServiceMutationOptions) {
  return useDeliveryServiceMutation<DeliveryServiceInput>(createDeliveryServiceAction, options);
}

export function useUpdateDeliveryServiceMutation(options?: DeliveryServiceMutationOptions) {
  return useDeliveryServiceMutation<{ id: string } & UpdateDeliveryServiceInput>(
    updateDeliveryServiceAction,
    options,
  );
}

export function useDeliveryServiceStatusMutation(options?: DeliveryServiceMutationOptions) {
  return useDeliveryServiceMutation<{ id: string; enabled: boolean }>(
    async ({ id, enabled }) =>
      (enabled ? enableDeliveryServiceAction : disableDeliveryServiceAction)({ id }),
    options,
  );
}

export function useDeleteDeliveryServiceMutation(options?: DeliveryServiceMutationOptions) {
  return useDeliveryServiceMutation<{ id: string }>(deleteDeliveryServiceAction, options);
}

export function useCreateDeliveryService(onSuccess: () => void) {
  const formRef = useRef<FormHandle<DeliveryServiceInput>>(null);
  const { isPending, mutateAsync } = useCreateDeliveryServiceMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });
  const handleSubmit = useCallback(
    async (input: DeliveryServiceInput) => {
      if (isPending) return;
      try {
        await mutateAsync(input);
        onSuccess();
      } catch {
        // The mutation callback reports normalized errors.
      }
    },
    [isPending, mutateAsync, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useUpdateDeliveryService(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<UpdateDeliveryServiceInput>>(null);
  const { isPending, mutateAsync } = useUpdateDeliveryServiceMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });
  const handleSubmit = useCallback(
    async (input: UpdateDeliveryServiceInput) => {
      if (isPending) return;
      try {
        await mutateAsync({ id, ...input });
        onSuccess();
      } catch {
        // The mutation callback reports normalized errors.
      }
    },
    [id, isPending, mutateAsync, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useDeliveryServiceStatus() {
  const { isPending, mutateAsync } = useDeliveryServiceStatusMutation();
  const update = useCallback(
    async (id: string, enabled: boolean) => {
      if (isPending) return;
      try {
        await mutateAsync({ id, enabled });
      } catch {
        // The mutation callback reports normalized errors.
      }
    },
    [isPending, mutateAsync],
  );
  return { isPending, update } as const;
}

export function useDeleteDeliveryService(onSuccess: () => void) {
  const { isPending, mutateAsync } = useDeleteDeliveryServiceMutation();
  const remove = useCallback(
    async (id: string) => {
      if (isPending) return;
      try {
        await mutateAsync({ id });
        onSuccess();
      } catch {
        // The mutation callback reports normalized errors.
      }
    },
    [isPending, mutateAsync, onSuccess],
  );
  return { isPending, remove } as const;
}
