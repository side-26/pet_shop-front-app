'use client';

import { useRouter } from 'next/navigation';

import { Switch } from '@/components/ui/fields/switch';
import { useBreedStatus } from '@/entities/breeds/breeds.client';

type Props = {
  breedId: string;
  breedTitle: string;
  isEnabled: boolean;
  disabled?: boolean;
};

export function BreedEnabledSwitch({ breedId, breedTitle, isEnabled, disabled = false }: Props) {
  const router = useRouter();
  const { isPending, update } = useBreedStatus(router.refresh);

  return (
    <Switch
      checked={isEnabled}
      loading={isPending}
      disabled={disabled}
      size="sm"
      checkedColor="success"
      uncheckedColor="error"
      aria-label={`${breedTitle}: ${isEnabled ? 'فعال' : 'غیرفعال'}`}
      onCheckedChange={(checked) => update(breedId, checked)}
    />
  );
}
