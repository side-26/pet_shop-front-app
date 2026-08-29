'use client';

import { lazy, Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteUserByIdAction, userGetDetailByIdAction } from '@/entities/users/users.actions';
import { globalErrorHandler } from '@/utils/helpers';
import { useCommonStore } from '@/stores/common.store';

const LazyUserInfoDialog = lazy(async () => {
  const dialog = await import('./user-info-dialog');

  return { default: dialog.UserInfoDialog };
});

type UserDetailRequest = ReturnType<typeof userGetDetailByIdAction>;

type UsersRowActionsProps = {
  userId: string;
  userName: string;
  disabled?: boolean;
};

export function UsersRowActions({ userId, userName, disabled = false }: UsersRowActionsProps) {
  const router = useRouter();
  const showConfirmDialog = useCommonStore((state) => state.showConfirmDialog);
  const [detailRequest, setDetailRequest] = useState<UserDetailRequest | null>(null);

  function openUserInfo() {
    if (disabled) return;
    setDetailRequest(userGetDetailByIdAction({ id: userId }));
  }

  function confirmUserDeletion() {
    if (disabled) return;

    showConfirmDialog({
      title: 'کاربر حذف شود؟',
      message: `کاربر «${userName}» به‌صورت دائمی حذف خواهد شد. این عمل قابل بازگشت نیست.`,
      icon: Trash2Icon,
      variant: 'error',
      onSuccess: async () => {
        const result = await deleteUserByIdAction({ id: userId });

        if (!result.isSuccess) {
          globalErrorHandler(result);
          return;
        }

        toast.add({ type: 'success', title: result.message });
        router.refresh();
      },
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={disabled}
          render={
            <Button
              type="button"
              iconOnly
              size="sm"
              variant="flat"
              color="secondary"
              aria-label={`عملیات ${userName}`}
            />
          }
        >
          <MoreHorizontalIcon aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={openUserInfo}>
              <EyeIcon aria-hidden="true" />
              مشاهده اطلاعات کاربر
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={confirmUserDeletion}>
              <Trash2Icon aria-hidden="true" />
              حذف کاربر
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {detailRequest ? (
        <Suspense fallback={null}>
          <LazyUserInfoDialog
            userName={userName}
            userRequest={detailRequest}
            onClose={() => setDetailRequest(null)}
          />
        </Suspense>
      ) : null}
    </>
  );
}
