'use client';

import { useRouter } from 'next/navigation';

import { Switch } from '@/components/ui/fields/switch';
import { useCategoryRowActions } from '@/entities/categories/categories.client';

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
  const router = useRouter();
  const { isPending, enable, disable } = useCategoryRowActions(router.refresh);

  return (
    <Switch
      checked={isEnabled}
      loading={isPending}
      disabled={disabled}
      size="sm"
      checkedColor="success"
      uncheckedColor="error"
      aria-label={`${categoryTitle}: ${isEnabled ? 'فعال' : 'غیرفعال'}`}
      onCheckedChange={(checked) => (checked ? enable(categoryId) : disable(categoryId))}
    />
  );
}
