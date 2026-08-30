'use client';

import { useRouter } from 'next/navigation';

import { Switch } from '@/components/ui/fields/switch';
import { usePetTypeRowActions } from '@/entities/pet-types/pet-types.client';

type PetTypeEnabledSwitchProps = {
  petTypeId: string;
  petTypeTitle: string;
  isEnabled: boolean;
  disabled?: boolean;
};

export function PetTypeEnabledSwitch({
  petTypeId,
  petTypeTitle,
  isEnabled,
  disabled = false,
}: PetTypeEnabledSwitchProps) {
  const router = useRouter();
  const { isPending, enable, disable } = usePetTypeRowActions(router.refresh);
  const statusLabel = isEnabled ? 'فعال' : 'غیرفعال';

  return (
    <Switch
      checked={isEnabled}
      loading={isPending}
      disabled={disabled}
      size="sm"
      checkedColor="success"
      uncheckedColor="error"
      aria-label={`${petTypeTitle}: ${statusLabel}`}
      onCheckedChange={(checked) => (checked ? enable(petTypeId) : disable(petTypeId))}
    />
  );
}
