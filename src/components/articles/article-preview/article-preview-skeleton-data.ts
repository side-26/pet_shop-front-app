import type { RichTextDocument } from '@/lib/rich-text';

export const articlePreviewSkeletonMainText = {
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'عنوان مقاله' }] },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'محتوای مقاله در حال بارگذاری است و در چند خط نمایش داده می‌شود.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'این متن برای حفظ ساختار و جلوگیری از جابه‌جایی چیدمان استفاده می‌شود.',
        },
      ],
    },
  ],
} satisfies RichTextDocument;
