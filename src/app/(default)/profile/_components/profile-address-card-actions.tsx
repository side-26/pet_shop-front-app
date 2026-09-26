'use client';

import { PencilIcon, Trash2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { deleteProfileAddressAction } from '@/entities/profile/profile.actions';
import { useCommonStore } from '@/stores/common.store';
import { globalErrorHandler } from '@/utils/helpers';

type Props = Readonly<{
  addressId?: string;
  addressTitle: string;
}>;

export function ProfileAddressCardActions({ addressId, addressTitle }: Props) {
  const showConfirmDialog = useCommonStore((state) => state.showConfirmDialog);

  function confirmDeletion() {
    if (!addressId) return;

    showConfirmDialog({
      title: 'نشانی حذف شود؟',
      message: `نشانی «${addressTitle}» به‌صورت دائمی حذف خواهد شد. این عمل قابل بازگشت نیست.`,
      icon: Trash2Icon,
      size: 'sm',
      variant: 'error',
      onSuccess: async () => {
        const result = await deleteProfileAddressAction({ addressId });
        if (!result)
          return globalErrorHandler({
            isSuccess: false,
            message: 'حذف نشانی انجام نشد.',
            data: { messages: {}, details: {} },
          });
        if (!result.isSuccess) return globalErrorHandler(result);
        toast.add({ type: 'success', title: result.message || 'نشانی با موفقیت حذف شد.' });
      },
    });
  }

  return (
    <div className="tw:flex tw:items-center tw:gap-1">
      <Button type="button" size="sm" variant="flat" iconOnly aria-label="ویرایش نشانی">
        <PencilIcon aria-hidden="true" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="flat"
        color="error"
        iconOnly
        disabled={!addressId}
        aria-label="حذف نشانی"
        onClick={confirmDeletion}
      >
        <Trash2Icon aria-hidden="true" />
      </Button>
    </div>
  );
}
