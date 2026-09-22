'use client';

import { create, type StateCreator } from 'zustand';

import type { CurrentUserDTO } from '@/entities/users/users.dto';

export type UserIdentitySlice = {
  userIdentity: CurrentUserDTO | null;
  saveUserIdentity: (userIdentity: CurrentUserDTO) => void;
  updateUserIdentity: (userIdentity: CurrentUserDTO) => void;
  deleteUserIdentity: () => void;
};

export const createUserIdentitySlice: StateCreator<UserIdentitySlice, [], [], UserIdentitySlice> = (
  set,
) => ({
  userIdentity: null,
  saveUserIdentity: (userIdentity) => set({ userIdentity }),
  updateUserIdentity: (userIdentity) => set({ userIdentity }),
  deleteUserIdentity: () => set({ userIdentity: null }),
});

export const useAuthStore = create<UserIdentitySlice>()((...args) => ({
  ...createUserIdentitySlice(...args),
}));
