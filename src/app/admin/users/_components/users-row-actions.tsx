'use client';

import { lazy, Suspense, useState } from 'react';
import { EyeIcon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { userGetDetailByIdAction } from '@/entities/users/users.actions';

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
  const [detailRequest, setDetailRequest] = useState<UserDetailRequest | null>(null);

  function openUserInfo() {
    if (disabled) return;
    setDetailRequest(userGetDetailByIdAction({ id: userId }));
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
            <DropdownMenuItem variant="destructive">
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
