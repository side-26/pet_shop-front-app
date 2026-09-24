'use client';

import { useRef } from 'react';
import { PackagePlus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
  CreateNewAddressDialog,
  type CreateNewAddressDialogHandle,
} from './create-new-address-dialog';

export function CreateNewAddressButton() {
  const dialogRef = useRef<CreateNewAddressDialogHandle>(null);

  return (
    <>
      <Button type="button" size="lg" onClick={() => dialogRef.current?.open()}>
        <PackagePlus data-icon="inline-start" aria-hidden="true" />
        افزودن نشانی جدید
      </Button>
      <CreateNewAddressDialog ref={dialogRef} />
    </>
  );
}
