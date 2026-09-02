'use client';

import { useRouter } from 'next/navigation';

import { Switch } from '@/components/ui/fields/switch';
import { usePetRowActions } from '@/entities/pets/pets.client';

type Props = { petId: string; petTitle: string; isEnable: boolean; disabled?: boolean };

export function PetEnabledSwitch({ petId, petTitle, isEnable, disabled = false }: Props) {
  const router = useRouter();
  const actions = usePetRowActions(router.refresh);
  return (
    <Switch
      checked={isEnable}
      loading={actions.isPending}
      disabled={disabled}
      size="sm"
      checkedColor="success"
      uncheckedColor="error"
      aria-label={`${petTitle}: ${isEnable ? 'فعال' : 'غیرفعال'}`}
      onCheckedChange={(value) => (value ? actions.enable(petId) : actions.disable(petId))}
    />
  );
}
