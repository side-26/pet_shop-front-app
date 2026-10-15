'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, useTransition } from 'react';
import type { UseFormSetError } from 'react-hook-form';

import type { FormHandle } from '@/components/ui/form';
import { toast } from '@/components/ui/toast';
import { useAuthStore } from '@/entities/auth/auth.store';
import { globalErrorHandler } from '@/utils/helpers';
import type { FetcherError } from '@/lib/api/customFetcher';

import {
  addWishlistItemAction,
  changeCurrentUserPasswordAction,
  createUserAction,
  disableUserByIdAction,
  deleteWishlistItemAction,
  enableUserByIdAction,
  getWishlistAction,
  updateCurrentUserProfileAction,
} from './users.actions';
import type {
  AddWishlistItemInput,
  ChangeCurrentUserPasswordInput,
  CreateUserInput,
  UpdateCurrentUserProfileInput,
} from './users.schema';
import type { WishlistItemDTO } from './users.dto';

const wishlistQueryKey = ['users', 'wishlist'] as const;
const wishlistMutationKey = [...wishlistQueryKey, 'toggle'] as const;

type WishlistMutationOperation = 'add' | 'remove';

type WishlistToggleVariables = Readonly<{
  item: AddWishlistItemInput;
  operation: WishlistMutationOperation;
  wishlistEntryId?: string;
}>;

type WishlistMutationContext = Readonly<{
  item: AddWishlistItemInput;
  optimisticEntryId?: string;
  operation: WishlistMutationOperation;
  removedEntry?: WishlistItemDTO;
}>;

type WishlistMutationResult = Readonly<{
  addedEntry?: WishlistItemDTO;
  operation: WishlistMutationOperation;
}>;

function wishlistItemId(entry: WishlistItemDTO) {
  if (typeof entry.item === 'string') return entry.item;
  if (entry.item && typeof entry.item === 'object') {
    const item = entry.item as { _id?: unknown; id?: unknown };
    return typeof item._id === 'string' ? item._id : typeof item.id === 'string' ? item.id : null;
  }
  return null;
}

function findWishlistEntry(wishlist: readonly WishlistItemDTO[], item: AddWishlistItemInput) {
  return wishlist.find(
    (entry) => wishlistItemId(entry) === item.itemId && entry.itemType === item.itemType,
  );
}

async function fetchWishlist() {
  const result = await getWishlistAction();
  if (!result.isSuccess) throw new Error(result.message ?? 'دریافت علاقه‌مندی‌ها ناموفق بود.');
  return result.data;
}

export function useWishlist() {
  return useQuery({ queryKey: wishlistQueryKey, queryFn: fetchWishlist });
}

export function useWishlistToggle() {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    WishlistMutationResult,
    FetcherError | Error,
    WishlistToggleVariables,
    WishlistMutationContext
  >({
    mutationKey: wishlistMutationKey,
    retry: false,
    mutationFn: async ({ item, operation, wishlistEntryId }) => {
      const result =
        operation === 'add'
          ? await addWishlistItemAction(item)
          : await deleteWishlistItemAction({ id: wishlistEntryId ?? '' });

      if (!result) throw new Error('ویرایش علاقه‌مندی‌ها ناموفق بود.');
      if (!result.isSuccess) throw result;

      return {
        operation,
        addedEntry: operation === 'add' ? (result.data as WishlistItemDTO) : undefined,
      };
    },
    onMutate: async ({ item, operation }) => {
      await queryClient.cancelQueries({ queryKey: wishlistQueryKey });

      const wishlist = queryClient.getQueryData<WishlistItemDTO[]>(wishlistQueryKey) ?? [];
      const matchingEntry = findWishlistEntry(wishlist, item);

      if (operation === 'remove') {
        queryClient.setQueryData<WishlistItemDTO[]>(wishlistQueryKey, (current = []) =>
          current.filter(
            (entry) => wishlistItemId(entry) !== item.itemId || entry.itemType !== item.itemType,
          ),
        );

        return { item, operation, removedEntry: matchingEntry };
      }

      const optimisticEntryId = `optimistic-${item.itemType}-${item.itemId}`;
      queryClient.setQueryData<WishlistItemDTO[]>(wishlistQueryKey, (current = []) =>
        findWishlistEntry(current, item)
          ? current
          : [...current, { _id: optimisticEntryId, item: item.itemId, itemType: item.itemType }],
      );

      return { item, operation, optimisticEntryId };
    },
    onError: (error, _variables, context) => {
      if (context?.operation === 'add' && context.optimisticEntryId) {
        queryClient.setQueryData<WishlistItemDTO[]>(wishlistQueryKey, (current = []) =>
          current.filter((entry) => entry._id !== context.optimisticEntryId),
        );
      }

      if (context?.operation === 'remove' && context.removedEntry) {
        queryClient.setQueryData<WishlistItemDTO[]>(wishlistQueryKey, (current = []) =>
          findWishlistEntry(current, context.item)
            ? current
            : [...current, context.removedEntry as WishlistItemDTO],
        );
      }

      if (error instanceof Error) toast.add({ type: 'error', title: error.message });
      else globalErrorHandler(error);
    },
    onSuccess: ({ addedEntry }, _variables, context) => {
      if (!addedEntry || !context?.optimisticEntryId) return;

      queryClient.setQueryData<WishlistItemDTO[]>(wishlistQueryKey, (current = []) =>
        current.map((entry) => (entry._id === context.optimisticEntryId ? addedEntry : entry)),
      );
    },
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey: wishlistMutationKey }) === 1) {
        void queryClient.invalidateQueries({ queryKey: wishlistQueryKey });
      }
    },
  });

  const toggleWishlistItem = (item: AddWishlistItemInput) => {
    const wishlist = queryClient.getQueryData<WishlistItemDTO[]>(wishlistQueryKey) ?? [];
    const wishlistEntry = findWishlistEntry(wishlist, item);

    mutation.mutate({
      item,
      operation: wishlistEntry ? 'remove' : 'add',
      wishlistEntryId: wishlistEntry?._id,
    });
  };

  return { isPending: mutation.isPending, toggleWishlistItem } as const;
}

export { wishlistItemId, wishlistQueryKey, type WishlistItemDTO };

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
  useAuthStore.getState().updateUserIdentity(result.data);
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
