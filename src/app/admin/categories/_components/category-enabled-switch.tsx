'use client';

import { Switch } from '@/components/ui/fields/switch';
import { useCategoryStatus } from '@/entities/categories/categories.client';

type Props = {
  categoryId: string;
  categoryTitle: string;
  isEnabled: boolean;
  disabled?: boolean;
};

export function CategoryEnabledSwitch({
  categoryId,
  categoryTitle,
  isEnabled,
  disabled = false,
}: Props) {
  const { isPending, update } = useCategoryStatus();

  return (
    <Switch
      checked={isEnabled}
      loading={isPending}
      disabled={disabled}
      size="sm"
      checkedColor="success"
      uncheckedColor="error"
      aria-label={`${categoryTitle}: ${isEnabled ? 'فعال' : 'غیرفعال'}`}
      onCheckedChange={(checked) => update(categoryId, checked)}
    />
  );
}
