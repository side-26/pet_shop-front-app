'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';

import type { FormHandle } from '@/components/ui/form';
import type { FetcherError } from '@/lib/api/customFetcher';
import {
  type ActionMutation,
  type ActionMutationOptions,
  useMutationOptions,
} from '@/hooks/use-mutation-options';
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

type DeliveryServiceMutationOptions<TVariables> = ActionMutationOptions<TVariables>;

/** Server reads refresh through EntityTags; checkout quotes refresh through this client query prefix. */
function useDeliveryServiceMutation<TVariables>(
  action: ActionMutation<TVariables>,
  { onSuccess, ...options }: DeliveryServiceMutationOptions<TVariables> = {},
) {
  const queryClient = useQueryClient();
  return useMutation(
    useMutationOptions(action, {
      ...options,
      onSuccess: async (result, variables, context, mutationContext) => {
        await queryClient.invalidateQueries({
          queryKey: deliveryServicesQueryKeys.availablePrefix,
        });
        await onSuccess?.(result, variables, context, mutationContext);
      },
    }),
  );
}

export function useCreateDeliveryServiceMutation(
  options?: DeliveryServiceMutationOptions<DeliveryServiceInput>,
) {
  return useDeliveryServiceMutation<DeliveryServiceInput>(createDeliveryServiceAction, options);
}

export function useUpdateDeliveryServiceMutation(
  options?: DeliveryServiceMutationOptions<{ id: string } & UpdateDeliveryServiceInput>,
) {
  return useDeliveryServiceMutation<{ id: string } & UpdateDeliveryServiceInput>(
    updateDeliveryServiceAction,
    options,
  );
}

export function useDeliveryServiceStatusMutation(
  options?: DeliveryServiceMutationOptions<{ id: string; enabled: boolean }>,
) {
  return useDeliveryServiceMutation<{ id: string; enabled: boolean }>(
    async ({ id, enabled }) =>
      (enabled ? enableDeliveryServiceAction : disableDeliveryServiceAction)({ id }),
    options,
  );
}

export function useDeleteDeliveryServiceMutation(
  options?: DeliveryServiceMutationOptions<{ id: string }>,
) {
  return useDeliveryServiceMutation<{ id: string }>(deleteDeliveryServiceAction, options);
}

export function useCreateDeliveryService(onSuccess: () => void) {
  const formRef = useRef<FormHandle<DeliveryServiceInput>>(null);
  const { isPending, mutate } = useCreateDeliveryServiceMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });
  const handleSubmit = useCallback(
    (input: DeliveryServiceInput) => {
      if (isPending) return;
      mutate(input, { onSuccess });
    },
    [isPending, mutate, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useUpdateDeliveryService(id: string, onSuccess: () => void) {
  const formRef = useRef<FormHandle<UpdateDeliveryServiceInput>>(null);
  const { isPending, mutate } = useUpdateDeliveryServiceMutation({
    onError: (error) => {
      const form = formRef.current;
      globalErrorHandler(error, form ? { showErrorFields: form.setError } : undefined);
    },
  });
  const handleSubmit = useCallback(
    (input: UpdateDeliveryServiceInput) => {
      if (isPending) return;
      mutate({ id, ...input }, { onSuccess });
    },
    [id, isPending, mutate, onSuccess],
  );
  return { formRef, handleSubmit, isPending } as const;
}

export function useDeliveryServiceStatus() {
  const { isPending, mutate } = useDeliveryServiceStatusMutation();
  const update = useCallback(
    (id: string, enabled: boolean) => {
      if (isPending) return;
      mutate({ id, enabled });
    },
    [isPending, mutate],
  );
  return { isPending, update } as const;
}

export function useDeleteDeliveryService(onSuccess: () => void) {
  const { isPending, mutate } = useDeleteDeliveryServiceMutation();
  const remove = useCallback(
    (id: string) => {
      if (isPending) return;
      mutate({ id }, { onSuccess });
    },
    [isPending, mutate, onSuccess],
  );
  return { isPending, remove } as const;
}
