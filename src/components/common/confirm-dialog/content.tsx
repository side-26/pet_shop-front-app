'use client';

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent as AlertDialogContentPrimitive,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCommonStore } from '@/stores/common.store';

export function ConfirmDialogContent() {
  const confirmDialog = useCommonStore((state) => state.confirmDialog);
  if (!confirmDialog.open) {
    return null;
  }

  const Icon = confirmDialog.icon;

  return (
    <AlertDialogContentPrimitive size={confirmDialog.size}>
      <AlertDialogHeader>
        <AlertDialogMedia>
          <Icon />
        </AlertDialogMedia>
        <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
        <AlertDialogDescription>{confirmDialog.message}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction
          color={confirmDialog.variant}
          isLoading={confirmDialog.isPending}
          loadingText="در حال انجام…"
          onClick={() => void confirmDialog.onSuccess()}
        >
          تأیید
        </AlertDialogAction>
        <AlertDialogCancel disabled={confirmDialog.isPending} onClick={confirmDialog.onIgnore}>
          انصراف
        </AlertDialogCancel>
      </AlertDialogFooter>
    </AlertDialogContentPrimitive>
  );
}
