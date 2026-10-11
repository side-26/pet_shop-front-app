'use client';

import { EyeIcon, FilePenLineIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const { openUpdateMainInfo } = useArticlesTableDialogs();
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
            <DropdownMenuItem disabled>
              <FilePenLineIcon aria-hidden="true" />
              ویرایش متن مقاله
            </DropdownMenuItem>
            <DropdownMenuItem disabled variant="destructive">
              <Trash2Icon aria-hidden="true" />
              حذف مقاله
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
