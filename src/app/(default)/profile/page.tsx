import type { Metadata } from 'next';

import { ProfilePageContent } from './_components/profile-page-content';

export const metadata: Metadata = {
  title: 'حساب کاربری من | پناهگاه پرشین',
  description: 'مدیریت اطلاعات شخصی، سفارش‌ها و نشانی‌های حساب کاربری.',
};

export default function ProfilePage() {
  return <ProfilePageContent />;
}
