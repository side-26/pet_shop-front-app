'use client';

import { Switch } from '@/components/ui/fields/switch';
import { usePetTypeStatus } from '@/entities/pet-types/pet-types.client';

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
  const { isPending, update } = usePetTypeStatus();
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
      onCheckedChange={(checked) => update(petTypeId, checked)}
    />
  );
}
