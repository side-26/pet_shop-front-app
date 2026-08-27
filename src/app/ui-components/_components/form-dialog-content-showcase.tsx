'use client';

import { useState } from 'react';

import { FormDialogContent } from '@/components/common/form-dialog-content';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/fields/input';

import { ShowcaseSection } from './showcase-section';

export function FormDialogContentShowcase() {
  const [open, setOpen] = useState(false);

  return (
    <ShowcaseSection
      id="form-dialog-content"
      title="Form Dialog Content"
      description="ترکیب مشترک گفتگو، کارت، محتوای فرم و اقدام‌های ثبت و انصراف با حالت بارگذاری."
    >
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button variant="outlined" />}>نمایش فرم گفتگو</DialogTrigger>
        <FormDialogContent
          title="ثبت نشانی جدید"
          formId="gallery-address-form"
          submitText="ثبت نشانی"
          onClose={() => setOpen(false)}
        >
          <form id="gallery-address-form" className="tw:flex tw:flex-col tw:gap-3">
            <Input aria-label="عنوان نشانی" placeholder="برای مثال: خانه" />
          </form>
        </FormDialogContent>
      </Dialog>
    </ShowcaseSection>
  );
}
