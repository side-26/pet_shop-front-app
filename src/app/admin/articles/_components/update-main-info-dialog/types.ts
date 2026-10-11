import type { DialogHandle } from '@/_types';

export type UpdateMainInfoDialogParams = Readonly<{
  id: string;
}>;

export type UpdateMainInfoDialogHandle = DialogHandle<UpdateMainInfoDialogParams>;
