'use client';

import { Dialog } from '@/components/ui/dialog';

import { ProductSectionDialogContentWrapper } from './product-section-dialog-content-wrapper';
import type {
  ProductFormOptionsRequest,
  ProductSection,
  ProductSectionRequest,
} from './product-section-dialog.types';

type Props = {
  productId: string;
  productTitle: string;
  section: ProductSection;
  request: ProductSectionRequest;
  optionsRequest: ProductFormOptionsRequest;
  onClose: () => void;
  onUpdated: () => void;
};

export function ProductSectionDialog(props: Props) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) props.onClose();
      }}
    >
      <ProductSectionDialogContentWrapper {...props} />
    </Dialog>
  );
}
