'use client';

import { useState } from 'react';
import { EyeIcon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getSubCategoryByIdAction } from '@/entities/sub-categories/sub-categories.actions';
import { useDeleteSubCategory } from '@/entities/sub-categories/sub-categories.client';
import { useCommonStore } from '@/stores/common.store';

import type { SubCategoryOption } from './sub-categories-form.types';
import { SubCategoryDetailDialog } from './sub-category-detail-dialog';

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
  const showConfirmDialog = useCommonStore((state) => state.showConfirmDialog);
  const { remove } = useDeleteSubCategory(() => undefined);
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
        await remove(subCategoryId);
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
        <SubCategoryDetailDialog
          subCategoryId={subCategoryId}
          request={detailRequest}
          categories={categories}
          onClose={() => setDetailRequest(null)}
          onUpdated={() => {
            setDetailRequest(null);
          }}
        />
      ) : null}
    </>
  );
}
