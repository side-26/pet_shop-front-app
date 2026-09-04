'use client';

import { useRouter } from 'next/navigation';

import { Switch } from '@/components/ui/fields/switch';
import { useProductRowActions } from '@/entities/products/products.client';

type Props = { productId: string; productTitle: string; isEnable: boolean; disabled?: boolean };

export function ProductEnabledSwitch({
  productId,
  productTitle,
  isEnable,
  disabled = false,
}: Props) {
  const router = useRouter();
  const actions = useProductRowActions(router.refresh);
  return (
    <Switch
      checked={isEnable}
      loading={actions.isPending}
      disabled={disabled}
      size="sm"
      checkedColor="success"
      uncheckedColor="error"
      aria-label={`${productTitle}: ${isEnable ? 'فعال' : 'غیرفعال'}`}
      onCheckedChange={(value) => (value ? actions.enable(productId) : actions.disable(productId))}
    />
  );
}
