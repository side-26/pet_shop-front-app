'use client';

import {
  EyeIcon,
  FilePenLineIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TagsIcon,
  Trash2Icon,
} from 'lucide-react';
import { useRouter } from 'nextjs-toploader/app';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteArticle } from '@/entities/articles/articles.client';
import { useCommonStore } from '@/stores/common.store';

import { useArticlesTableDialogs } from './articles-table-dialog-provider';

type ArticlesRowActionsProps = {
  articleId: string;
  articleTitle: string;
  disabled?: boolean;
};

export function ArticlesRowActions({
  articleId,
  articleTitle,
  disabled = false,
}: ArticlesRowActionsProps) {
  const router = useRouter();
  const showConfirmDialog = useCommonStore((state) => state.showConfirmDialog);
  const { deleteArticle } = useDeleteArticle(router.refresh);
  const { openUpdateMainInfo, openUpdateMainText, openUpdateTags } = useArticlesTableDialogs();

  function confirmDeletion() {
    if (disabled) return;

    showConfirmDialog({
      title: 'مقاله حذف شود؟',
      message: `مقاله «${articleTitle}» به‌صورت دائمی حذف خواهد شد. این عمل قابل بازگشت نیست.`,
      icon: Trash2Icon,
      variant: 'error',
      onSuccess: async () => {
        await deleteArticle(articleId);
      },
    });
  }

  return (
    <div className="tw:flex tw:items-center tw:justify-end tw:gap-1">
      <Button
        type="button"
        iconOnly
        size="sm"
        variant="flat"
        color="secondary"
        disabled={disabled}
        aria-label={`پیش‌نمایش ${articleTitle}`}
      >
        <EyeIcon aria-hidden="true" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={disabled}
          render={
            <Button
              type="button"
              iconOnly
              size="sm"
              variant="flat"
              color="secondary"
              aria-label={`عملیات ${articleTitle}`}
            />
          }
        >
          <MoreHorizontalIcon aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem disabled={disabled} onClick={() => openUpdateMainInfo(articleId)}>
              <PencilIcon aria-hidden="true" />
              ویرایش اطلاعات اصلی
            </DropdownMenuItem>
            <DropdownMenuItem disabled={disabled} onClick={() => openUpdateMainText(articleId)}>
              <FilePenLineIcon aria-hidden="true" />
              ویرایش متن مقاله
            </DropdownMenuItem>
            <DropdownMenuItem disabled={disabled} onClick={() => openUpdateTags(articleId)}>
              <TagsIcon aria-hidden="true" />
              ویرایش برچسب‌ها
            </DropdownMenuItem>
            <DropdownMenuItem disabled={disabled} variant="destructive" onClick={confirmDeletion}>
              <Trash2Icon aria-hidden="true" />
              حذف مقاله
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
