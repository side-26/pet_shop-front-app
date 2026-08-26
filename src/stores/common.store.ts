'use client';

import type { LucideIcon } from 'lucide-react';
import { create, type StateCreator } from 'zustand';

import type { AlertDialogContentProps } from '@/components/ui/alert-dialog';
import type { ButtonProps } from '@/components/ui/button';

export type ConfirmDialogSize = NonNullable<AlertDialogContentProps['size']>;
export type ConfirmDialogVariant = NonNullable<ButtonProps['color']>;

type ConfirmDialogContent = Readonly<{
  title: string;
  message: string;
  size: ConfirmDialogSize;
  variant: ConfirmDialogVariant;
  onSuccess: () => Promise<void>;
  onIgnore: () => void;
}>;

export type ConfirmDialogState =
  | (ConfirmDialogContent &
      Readonly<{
        open: true;
        isPending: boolean;
        icon: LucideIcon;
      }>)
  | (ConfirmDialogContent &
      Readonly<{
        open: false;
        isPending: false;
        icon: null;
      }>);

export type ShowConfirmDialogInput = Readonly<{
  title: string;
  message: string;
  icon: LucideIcon;
  size?: ConfirmDialogSize;
  variant?: ConfirmDialogVariant;
  onSuccess: () => Promise<void>;
  onIgnore?: () => void;
}>;

export type ConfirmDialogSlice = {
  confirmDialog: ConfirmDialogState;
  showConfirmDialog: (input: ShowConfirmDialogInput) => void;
  hideConfirmDialog: () => void;
  setPending: (isPending: boolean) => void;
};

function createInitialConfirmDialog(): ConfirmDialogState {
  return {
    open: false,
    isPending: false,
    title: '',
    message: '',
    icon: null,
    size: 'sm',
    variant: 'warning',
    onSuccess: async () => undefined,
    onIgnore: () => undefined,
  };
}

export const createConfirmDialogSlice: StateCreator<
  ConfirmDialogSlice,
  [],
  [],
  ConfirmDialogSlice
> = (set, get) => ({
  confirmDialog: createInitialConfirmDialog(),

  hideConfirmDialog: () => {
    set({ confirmDialog: createInitialConfirmDialog() });
  },

  setPending: (isPending) => {
    set(({ confirmDialog }) => ({
      confirmDialog: confirmDialog.open
        ? { ...confirmDialog, isPending }
        : createInitialConfirmDialog(),
    }));
  },

  showConfirmDialog: ({ size = 'sm', variant = 'warning', onSuccess, onIgnore, ...content }) => {
    const hideConfirmDialog = get().hideConfirmDialog;

    set({
      confirmDialog: {
        ...content,
        open: true,
        isPending: false,
        size,
        variant,
        onIgnore: onIgnore ?? hideConfirmDialog,
        onSuccess: async () => {
          get().setPending(true);

          try {
            await onSuccess();
          } finally {
            hideConfirmDialog();
          }
        },
      },
    });
  },
});

export const useCommonStore = create<ConfirmDialogSlice>()((...args) => ({
  ...createConfirmDialogSlice(...args),
}));
