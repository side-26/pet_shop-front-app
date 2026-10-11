'use client';

import { createContext, use, useMemo, useRef, type ReactNode } from 'react';
import { useRouter } from 'nextjs-toploader/app';

import { useDialogController } from '@/hooks/use-dialog-controller';

import { CreateNewArticleDialog } from './create-new-article-dialog/wrapper';
import type {
  ArticlePetTypeOption,
  CreateNewArticleDialogHandle,
} from './create-new-article-dialog/types';
import { UpdateMainInfoDialogWrapper } from './update-main-info-dialog/wrapper';
import type { UpdateMainInfoDialogHandle } from './update-main-info-dialog/types';
import { UpdateMainTextDialogWrapper } from './update-main-text-dialog/wrapper';
import type { UpdateMainTextDialogHandle } from './update-main-text-dialog/types';
import { UpdateTagsDialogWrapper } from './update-tags-dialog/wrapper';
import type { UpdateTagsDialogHandle } from './update-tags-dialog/types';

type ArticlesTableDialogActions = Readonly<{
  openCreateNewArticle: () => void;
  openUpdateMainInfo: (id: string) => void;
  openUpdateMainText: (id: string) => void;
  openUpdateTags: (id: string) => void;
}>;

const ArticlesTableDialogContext = createContext<ArticlesTableDialogActions | null>(null);

export function useArticlesTableDialogs() {
  const context = use(ArticlesTableDialogContext);

  if (!context) throw new Error('Missing ArticlesTableDialogProvider');

  return context;
}

export function ArticlesTableDialogProvider({
  children,
  petTypes,
}: Readonly<{
  children: ReactNode;
  petTypes: readonly ArticlePetTypeOption[];
}>) {
  const router = useRouter();
  const createNewArticleRef = useRef<CreateNewArticleDialogHandle>(null);
  const updateMainInfoRef = useRef<UpdateMainInfoDialogHandle>(null);
  const updateMainTextRef = useRef<UpdateMainTextDialogHandle>(null);
  const updateTagsRef = useRef<UpdateTagsDialogHandle>(null);
  const { open } = useDialogController(
    useMemo(
      () => ({
        createNewArticle: { ref: createNewArticleRef },
        updateMainInfo: { ref: updateMainInfoRef },
        updateMainText: { ref: updateMainTextRef },
        updateTags: { ref: updateTagsRef },
      }),
      [],
    ),
  );
  const actions = useMemo<ArticlesTableDialogActions>(
    () => ({
      openCreateNewArticle: () => open('createNewArticle'),
      openUpdateMainInfo: (id) => open('updateMainInfo', { id }),
      openUpdateMainText: (id) => open('updateMainText', { id }),
      openUpdateTags: (id) => open('updateTags', { id }),
    }),
    [open],
  );

  return (
    <ArticlesTableDialogContext value={actions}>
      {children}
      <CreateNewArticleDialog
        ref={createNewArticleRef}
        onCreated={router.refresh}
        petTypes={petTypes}
      />
      <UpdateMainInfoDialogWrapper
        ref={updateMainInfoRef}
        onUpdated={router.refresh}
        petTypes={petTypes}
      />
      <UpdateMainTextDialogWrapper ref={updateMainTextRef} onUpdated={router.refresh} />
      <UpdateTagsDialogWrapper ref={updateTagsRef} onUpdated={router.refresh} />
    </ArticlesTableDialogContext>
  );
}
