import type { DialogHandle } from '@/_types';

export type UpdateMainTextDialogParams = Readonly<{
  id: string;
}>;

export type UpdateMainTextDialogHandle = DialogHandle<UpdateMainTextDialogParams>;
