'use client';

import { lazy, Suspense, useState } from 'react';
import { EyeIcon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/toast';
import {
  deleteSubCategoryAction,
  getSubCategoryByIdAction,
} from '@/entities/sub-categories/sub-categories.actions';
import { useCommonStore } from '@/stores/common.store';
import { globalErrorHandler } from '@/utils/helpers';

import type { SubCategoryOption } from './sub-categories-form.types';

const LazySubCategoryDetailDialog = lazy(async () => {
  const dialog = await import('./sub-category-detail-dialog');
  return { default: dialog.SubCategoryDetailDialog };
});

type Props = {
  subCategoryId: string;
  subCategoryTitle: string;
  categories: readonly SubCategoryOption[];
  disabled?: boolean;
};

export function SubCategoryRowActions({
  subCategoryId,
  subCategoryTitle,
  categories,
  disabled = false,
}: Props) {
  const router = useRouter();
  const showConfirmDialog = useCommonStore((state) => state.showConfirmDialog);
  const [detailRequest, setDetailRequest] = useState<ReturnType<
    typeof getSubCategoryByIdAction
  > | null>(null);

  function openDetail() {
    if (!disabled) setDetailRequest(getSubCategoryByIdAction({ id: subCategoryId }));
  }

  function confirmDeletion() {
    if (disabled) return;
    showConfirmDialog({
      title: 'زیر دسته‌بندی حذف شود؟',
      message: `زیر دسته‌بندی «${subCategoryTitle}» به‌صورت دائمی حذف خواهد شد. این عمل قابل بازگشت نیست.`,
      icon: Trash2Icon,
      variant: 'error',
      onSuccess: async () => {
        const result = await deleteSubCategoryAction({ id: subCategoryId });
        if (!result.isSuccess) return globalErrorHandler(result);
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
              aria-label={`عملیات ${subCategoryTitle}`}
            />
          }
        >
          <MoreHorizontalIcon aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={openDetail}>
              <EyeIcon aria-hidden="true" />
              مشاهده و ویرایش
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={confirmDeletion}>
              <Trash2Icon aria-hidden="true" />
              حذف زیر دسته‌بندی
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {detailRequest ? (
        <Suspense fallback={null}>
          <LazySubCategoryDetailDialog
            subCategoryId={subCategoryId}
            request={detailRequest}
            categories={categories}
            onClose={() => setDetailRequest(null)}
            onUpdated={() => {
              setDetailRequest(null);
              router.refresh();
            }}
          />
        </Suspense>
      ) : null}
    </>
  );
}
