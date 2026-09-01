'use client';

import { Dialog } from '@/components/ui/dialog';
import { getSubCategoryByIdAction } from '@/entities/sub-categories/sub-categories.actions';

import type { SubCategoryOption } from './sub-categories-form.types';
import { SubCategoryDetailDialogContentWrapper } from './sub-category-detail-dialog-content-wrapper';

type Props = {
  subCategoryId: string;
  request: ReturnType<typeof getSubCategoryByIdAction>;
  categories: readonly SubCategoryOption[];
  onClose: () => void;
  onUpdated: () => void;
};

export function SubCategoryDetailDialog(props: Props) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) props.onClose();
      }}
    >
      <SubCategoryDetailDialogContentWrapper {...props} />
    </Dialog>
  );
}
