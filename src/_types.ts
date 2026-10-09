import type { UserRole } from '@/configs/user-role';

export interface AuthSessionModel {
  refreshToken: string;
  sessionExp: number;
  userId: string;
  role: UserRole;
  accessToken: string;
  accessExp: number;
}

// ----------dialog-controller----------------

// dialog.types.ts

export type DialogHandle<TParams = void> = {
  open: (params: TParams) => void;
  close: () => void;
};

export type DialogDefinition<TParams = void> = {
  ref: React.RefObject<DialogHandle<TParams> | null>;
};

export type DialogConfig = Record<string, DialogDefinition<any>>;

export type InferDialogParams<T> = T extends DialogDefinition<infer P> ? P : never;
