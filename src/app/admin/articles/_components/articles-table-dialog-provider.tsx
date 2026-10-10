'use client';

import { createContext, use, useMemo, useRef, type ReactNode } from 'react';
import { useRouter } from 'nextjs-toploader/app';

import { useDialogController } from '@/hooks/use-dialog-controller';

import { CreateNewArticleDialog } from './create-new-article-dialog/wrapper';
import type {
  ArticlePetTypeOption,
  CreateNewArticleDialogHandle,
} from './create-new-article-dialog/types';

type ArticlesTableDialogActions = Readonly<{
  openCreateNewArticle: () => void;
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
  const { open } = useDialogController(
    useMemo(() => ({ createNewArticle: { ref: createNewArticleRef } }), []),
  );
  const actions = useMemo<ArticlesTableDialogActions>(
    () => ({ openCreateNewArticle: () => open('createNewArticle') }),
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
    </ArticlesTableDialogContext>
  );
}
