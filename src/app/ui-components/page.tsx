import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { UiComponentsGalleryLoader } from './_components/ui-components-gallery-loader';

export const metadata: Metadata = {
  title: 'کتابخانه اجزای رابط کاربری | پت‌شاپ',
  description: 'نمایش زنده اجزای رابط کاربری پت‌شاپ و تمام حالت‌های پشتیبانی‌شده آن‌ها.',
};

export default function UiComponentsPage() {
  if (process.env.NODE_ENV === 'production') notFound();

  return <UiComponentsGalleryLoader />;
}
