'use client';

import { createContext, useContext } from 'react';

export type ProfileAddressDialogs = Readonly<{
  openCreate: () => void;
  openUpdate: (addressId: string) => void;
}>;

export const ProfileAddressDialogsContext = createContext<ProfileAddressDialogs | null>(null);

export function useProfileAddressDialogs() {
  const dialogs = useContext(ProfileAddressDialogsContext);

  if (!dialogs) throw new Error('Profile address dialogs must be used within their provider.');

  return dialogs;
}
