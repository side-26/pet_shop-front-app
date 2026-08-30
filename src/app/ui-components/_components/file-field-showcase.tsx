'use client';

import { ImageIcon } from 'lucide-react';

import { FileField } from '@/components/ui/fields/file-field';
import { Form } from '@/components/ui/form';

import { ShowcaseSection } from './showcase-section';

type FileFieldShowcaseValues = { image: File | null };

export function FileFieldShowcase() {
  return (
    <ShowcaseSection
      id="file-fields"
      title="FileField"
      description="انتخاب پرونده با پیش‌نمایش قابل‌سفارشی‌سازی و اتصال مستقیم به فرم."
    >
      <Form<FileFieldShowcaseValues>
        handleSubmit={() => undefined}
        options={{ defaultValues: { image: null } }}
        className="tw:max-w-md"
      >
        <FileField<FileFieldShowcaseValues>
          name="image"
          acceptTypes={['image/jpeg', 'image/png', 'image/webp']}
          hint="JPEG، PNG یا WebP را انتخاب کنید."
        >
          {(file) => (
            <div className="tw:flex tw:min-h-36 tw:flex-col tw:items-center tw:justify-center tw:gap-3 tw:rounded-2xl tw:border tw:border-dashed tw:border-border tw:bg-muted/40 tw:p-4 tw:text-center">
              <ImageIcon aria-hidden="true" />
              <span className="tw:text-body-m tw:font-medium">
                {file ? file.name : 'برای انتخاب تصویر اینجا را انتخاب کنید'}
              </span>
            </div>
          )}
        </FileField>
      </Form>
    </ShowcaseSection>
  );
}
