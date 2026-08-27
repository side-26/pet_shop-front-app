'use client';

import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { DialogContent, DialogTitle, type DialogContentProps } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type FormDialogContentProps = Omit<DialogContentProps, 'children' | 'showCloseButton'> & {
  children: ReactNode;
  contentClassName?: string;
  formId?: string;
  isLoading?: boolean;
  onClose: () => void;
  submitText?: ReactNode;
  title: ReactNode;
};

function FormDialogContent({
  children,
  className,
  contentClassName,
  formId,
  isLoading = false,
  onClose,
  submitText = 'agree',
  title,
  ...dialogContentProps
}: FormDialogContentProps) {
  return (
    <DialogContent
      className={cn('tw:overflow-hidden tw:p-0', className)}
      showCloseButton={false}
      {...dialogContentProps}
    >
      <Card variant="filled" className="tw:rounded-[inherit]">
        <CardHeader>
          <DialogTitle>{title}</DialogTitle>
        </CardHeader>

        <CardContent className={contentClassName}>{children}</CardContent>

        <CardFooter className="tw:flex-nowrap tw:gap-2">
          <div className="tw:flex-1">
            <Button
              block
              type="submit"
              form={formId}
              color="primary"
              variant="fill"
              isLoading={isLoading}
              loadingText={submitText}
            >
              {submitText}
            </Button>
          </div>
          <div className="tw:flex-1">
            <Button
              block
              type="button"
              color="error"
              variant="outlined"
              disabled={isLoading}
              onClick={onClose}
            >
              انصراف
            </Button>
          </div>
        </CardFooter>
      </Card>
    </DialogContent>
  );
}

export { FormDialogContent, type FormDialogContentProps };
