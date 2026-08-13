import type { Metadata } from 'next';

import { UiComponentsGallery } from './_components/ui-components-gallery';

export const metadata: Metadata = {
  title: 'کتابخانه اجزای رابط کاربری | پت‌شاپ',
  description: 'نمایش زنده اجزای رابط کاربری پت‌شاپ و تمام حالت‌های پشتیبانی‌شده آن‌ها.',
};

export default function UiComponentsPage() {
  return <UiComponentsGallery />;
}
