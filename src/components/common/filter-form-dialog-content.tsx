'use client';

import type { ComponentProps } from 'react';

import { FormDialogContent } from './form-dialog-content';

type FilterFormDialogContentProps = Omit<
  ComponentProps<typeof FormDialogContent>,
  'submitText' | 'title'
> & {
  submitText?: ComponentProps<typeof FormDialogContent>['submitText'];
  title?: ComponentProps<typeof FormDialogContent>['title'];
};

function FilterFormDialogContent({
  submitText = 'اعمال فیلتر',
  title = 'فیلترها',
  ...props
}: FilterFormDialogContentProps) {
  return <FormDialogContent {...props} submitText={submitText} title={title} />;
}

export { FilterFormDialogContent, type FilterFormDialogContentProps };
