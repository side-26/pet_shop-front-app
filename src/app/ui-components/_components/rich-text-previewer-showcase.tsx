import { RichTextPreviewer } from '@/components/ui/rich-text-previewer';

import { ShowcaseSection } from './showcase-section';

const content = {
  type: 'doc' as const,
  content: [
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'راهنمای مراقبت روزانه' }],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'آب تازه، غذای مناسب و زمان بازی منظم برای سلامت حیوان مهم هستند.' },
      ],
    },
    {
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'برای نگرانی‌های درمانی با دامپزشک مشورت کنید.' }],
        },
      ],
    },
  ],
};

export function RichTextPreviewerShowcase() {
  return (
    <ShowcaseSection
      id="rich-text-previewer"
      title="Rich Text Previewer"
      description="پیش‌نمایش سمت‌سرور محتوای JSON با ساختار معنایی RTL-first، تایپوگرافی واکنش‌گرا و تصویرهای قابل‌دسترس با کیفیت متناسب با اندازهٔ نمایشگر."
    >
      <RichTextPreviewer>
        <RichTextPreviewer.Content content={content} />
      </RichTextPreviewer>
    </ShowcaseSection>
  );
}
