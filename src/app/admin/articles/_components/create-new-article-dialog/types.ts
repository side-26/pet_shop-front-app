import type { DialogHandle } from '@/_types';

export type ArticlePetTypeOption = Readonly<{ id: string; image: string; title: string }>;

export type CreateNewArticleDialogHandle = DialogHandle<void>;
