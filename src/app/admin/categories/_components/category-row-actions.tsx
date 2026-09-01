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
  deleteCategoryAction,
  getCategoryByIdAction,
} from '@/entities/categories/categories.actions';
import { useCommonStore } from '@/stores/common.store';
import { globalErrorHandler } from '@/utils/helpers';

import type { CategoryPetTypeOption } from './categories-form.types';

const LazyCategoryDetailDialog = lazy(async () => {
  const dialog = await import('./category-detail-dialog');
  return { default: dialog.CategoryDetailDialog };
});

type Props = {
  categoryId: string;
  categoryTitle: string;
  petTypes: readonly CategoryPetTypeOption[];
  disabled?: boolean;
};

export function CategoryRowActions({
  categoryId,
  categoryTitle,
  petTypes,
  disabled = false,
}: Props) {
  const router = useRouter();
  const showConfirmDialog = useCommonStore((state) => state.showConfirmDialog);
  const [detailRequest, setDetailRequest] = useState<ReturnType<
    typeof getCategoryByIdAction
  > | null>(null);

  function openDetail() {
    if (!disabled) setDetailRequest(getCategoryByIdAction({ id: categoryId }));
  }

  function confirmDeletion() {
    if (disabled) return;
    showConfirmDialog({
      title: 'دسته‌بندی حذف شود؟',
      message: `دسته‌بندی «${categoryTitle}» به‌صورت دائمی حذف خواهد شد. این عمل قابل بازگشت نیست.`,
      icon: Trash2Icon,
      variant: 'error',
      onSuccess: async () => {
        const result = await deleteCategoryAction({ id: categoryId });
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
              aria-label={`عملیات ${categoryTitle}`}
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
              حذف دسته‌بندی
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {detailRequest ? (
        <Suspense fallback={null}>
          <LazyCategoryDetailDialog
            categoryId={categoryId}
            request={detailRequest}
            petTypes={petTypes}
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
