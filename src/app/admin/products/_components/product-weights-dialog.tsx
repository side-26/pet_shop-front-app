'use client';

import { Dialog } from '@/components/ui/dialog';
import { getProductWeightsAction } from '@/entities/products/products.actions';

import { ProductWeightsDialogContentWrapper } from './product-weights-dialog-content-wrapper';

type Props = {
  productId: string;
  productTitle: string;
  request: ReturnType<typeof getProductWeightsAction>;
  onClose: () => void;
  onUpdated: () => void;
};

export function ProductWeightsDialog(props: Props) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) props.onClose();
      }}
    >
      <ProductWeightsDialogContentWrapper {...props} />
    </Dialog>
  );
}
