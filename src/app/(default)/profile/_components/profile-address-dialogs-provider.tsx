'use client';

import { useMemo, useRef, type ReactNode } from 'react';

import { useDialogController } from '@/hooks/use-dialog-controller';

import {
  CreateNewAddressDialog,
  type CreateNewAddressDialogHandle,
} from './create-new-address-dialog';
import { UpdateAddressDialog, type UpdateAddressDialogHandle } from './update-address-dialog';
import {
  ProfileAddressDialogsContext,
  type ProfileAddressDialogs,
} from './profile-address-dialogs-context';

export function ProfileAddressDialogsProvider({ children }: Readonly<{ children: ReactNode }>) {
  const createAddressRef = useRef<CreateNewAddressDialogHandle>(null);
  const updateAddressRef = useRef<UpdateAddressDialogHandle>(null);
  const dialogs = useDialogController({
    createAddress: { ref: createAddressRef },
    updateAddress: { ref: updateAddressRef },
  });
  const value = useMemo<ProfileAddressDialogs>(
    () => ({
      openCreate: () => dialogs.open('createAddress'),
      openUpdate: (addressId) => dialogs.open('updateAddress', { addressId }),
    }),
    [dialogs],
  );

  return (
    <ProfileAddressDialogsContext value={value}>
      {children}
      <CreateNewAddressDialog ref={createAddressRef} />
      <UpdateAddressDialog ref={updateAddressRef} />
    </ProfileAddressDialogsContext>
  );
}
