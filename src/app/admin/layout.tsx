import type { Metadata } from 'next';

import { AdminLayoutShell } from '@/components/layouts/admin/admin-layout-shell';
import { AdminCurrentUserWrapper } from '@/components/layouts/admin/admin-current-user-wrapper';

export const metadata: Metadata = {
  title: 'پنل مدیریت | پت‌شاپ',
  description: 'مدیریت محصولات، حیوانات، کاربران و تنظیمات پت‌شاپ',
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AdminLayoutShell navigationIdentity={<AdminCurrentUserWrapper />}>{children}</AdminLayoutShell>
  );
}
