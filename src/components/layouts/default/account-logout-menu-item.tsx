'use client';

import { LogOut } from 'lucide-react';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useLogoutUser } from '@/entities/auth/auth.client';
import { useCommonStore } from '@/stores/common.store';

type AccountLogoutMenuItemProps = Readonly<{ label: string }>;

export function AccountLogoutMenuItem({ label }: AccountLogoutMenuItemProps) {
  const showConfirmDialog = useCommonStore((state) => state.showConfirmDialog);
  const logoutUser = useLogoutUser();

  return (
    <DropdownMenuItem
      variant="destructive"
      onClick={() => {
        showConfirmDialog({
          title: 'از حساب خارج می‌شوید؟',
          message: 'برای ادامه، لازم است دوباره وارد حساب کاربری خود شوید.',
          icon: LogOut,
          variant: 'warning',
          onSuccess: logoutUser,
        });
      }}
    >
      <LogOut aria-hidden="true" />
      {label}
    </DropdownMenuItem>
  );
}
