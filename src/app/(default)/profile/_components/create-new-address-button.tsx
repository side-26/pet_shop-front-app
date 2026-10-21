'use client';

import { PackagePlus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useProfileAddressDialogs } from './profile-address-dialogs-context';

export function CreateNewAddressButton({ disabled = false }: Readonly<{ disabled?: boolean }>) {
  const { openCreate } = useProfileAddressDialogs();

  return (
    <>
      <Button type="button" size="lg" disabled={disabled} onClick={openCreate}>
        <PackagePlus data-icon="inline-start" aria-hidden="true" />
        افزودن نشانی جدید
      </Button>
    </>
  );
}
