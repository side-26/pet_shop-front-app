'use client';

import { Dialog } from '@/components/ui/dialog';

import { CreateArticleDialogContentWrapper } from './create-article-dialog-content-wrapper';

type CreateArticleDialogProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}>;

export function CreateArticleDialog({ open, onOpenChange, onCreated }: CreateArticleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <CreateArticleDialogContentWrapper
        onClose={() => onOpenChange(false)}
        onCreated={onCreated}
      />
    </Dialog>
  );
}
