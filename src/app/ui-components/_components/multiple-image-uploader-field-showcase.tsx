'use client';

import {
  MultipleImageUploaderField,
  type MultipleImageUploaderValue,
} from '@/components/common/multiple-image-uploader-field';
import { Form } from '@/components/ui/form';

import { ShowcaseSection } from './showcase-section';

type ShowcaseValues = { gallery: MultipleImageUploaderValue };

export function MultipleImageUploaderFieldShowcase() {
  return (
    <ShowcaseSection
      id="multiple-image-uploader-fields"
      title="MultipleImageUploaderField"
      description="نمایش فقط‌خواندنی تصاویر فعلی در کنار انتخاب هم‌زمان یا مرحله‌ای تصاویر جدید."
    >
      <Form<ShowcaseValues>
        handleSubmit={() => undefined}
        options={{ defaultValues: { gallery: { images: [], mainImageIndex: null } } }}
        className="tw:max-w-3xl"
      >
        <MultipleImageUploaderField<ShowcaseValues>
          name="gallery"
          mainImageUrl="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=480&q=80"
          defaultImages={[
            'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=480&q=80',
            'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=480&q=80',
          ]}
          hint="حداکثر ۵ تصویر JPEG، PNG یا WebP انتخاب کنید."
        />
      </Form>
    </ShowcaseSection>
  );
}
