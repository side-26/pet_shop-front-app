'use client';

import { useState } from 'react';

import { FilterFormDialogContent } from '@/components/common/filter-form-dialog-content';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/fields/input';

import { ShowcaseSection } from './showcase-section';

export function FilterFormDialogContentShowcase() {
  const [open, setOpen] = useState(false);

  return (
    <ShowcaseSection
      id="filter-form-dialog-content"
      title="Filter Form Dialog Content"
      description="پوستهٔ مشترک برای فرم‌های فیلتر، با عنوان و اقدام اعمال فیلتر پیش‌فرض."
    >
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button variant="outlined" />}>نمایش فیلتر</DialogTrigger>
        <FilterFormDialogContent formId="gallery-filter-form" onClose={() => setOpen(false)}>
          <form id="gallery-filter-form" className="tw:flex tw:flex-col tw:gap-3">
            <Input aria-label="جست‌وجوی نمونه" placeholder="نام یا شناسه" />
          </form>
        </FilterFormDialogContent>
      </Dialog>
    </ShowcaseSection>
  );
}
