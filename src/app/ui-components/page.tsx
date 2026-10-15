import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const UiComponentsGallery = dynamic(
  () =>
    import('./_components/ui-components-gallery')?.then(
      ({ UiComponentsGallery }) => UiComponentsGallery,
    ),
  { ssr: false },
);

export const metadata: Metadata = {
  title: 'کتابخانه اجزای رابط کاربری | پت‌شاپ',
  description: 'نمایش زنده اجزای رابط کاربری پت‌شاپ و تمام حالت‌های پشتیبانی‌شده آن‌ها.',
};

export default function UiComponentsPage() {
  if (process.env.NODE_ENV === 'production') notFound();

  return <UiComponentsGallery />;
}
