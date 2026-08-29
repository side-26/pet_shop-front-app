'use client';

import { useRouter } from 'next/navigation';

import { Switch } from '@/components/ui/fields/switch';
import { useUserEnabledUpdate } from '@/entities/users/users.client';

type UserEnabledSwitchProps = {
  userId: string;
  userName: string;
  isEnable: boolean;
  disabled?: boolean;
};

export function UserEnabledSwitch({
  userId,
  userName,
  isEnable,
  disabled = false,
}: UserEnabledSwitchProps) {
  const router = useRouter();
  const { isPending, updateUserEnabled } = useUserEnabledUpdate(router.refresh);
  const statusLabel = isEnable ? 'فعال' : 'غیرفعال';

  return (
    <Switch
      checked={isEnable}
      loading={isPending}
      disabled={disabled}
      size="sm"
      checkedColor="success"
      uncheckedColor="error"
      aria-label={`${userName}: ${statusLabel}`}
      onCheckedChange={(nextValue) => updateUserEnabled(userId, nextValue)}
    />
  );
}
