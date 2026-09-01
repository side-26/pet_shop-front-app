'use client';

import { Dialog } from '@/components/ui/dialog';
import { getCategoryByIdAction } from '@/entities/categories/categories.actions';

import type { CategoryPetTypeOption } from './categories-form.types';
import { CategoryDetailDialogContentWrapper } from './category-detail-dialog-content-wrapper';

type Props = {
  categoryId: string;
  request: ReturnType<typeof getCategoryByIdAction>;
  petTypes: readonly CategoryPetTypeOption[];
  onClose: () => void;
  onUpdated: () => void;
};

export function CategoryDetailDialog(props: Props) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) props.onClose();
      }}
    >
      <CategoryDetailDialogContentWrapper {...props} />
    </Dialog>
  );
}
