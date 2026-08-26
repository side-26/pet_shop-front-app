import type { Metadata } from 'next';

import { AdminLayoutShell } from '@/components/layouts/admin/admin-layout-shell';

export const metadata: Metadata = {
  title: 'پنل مدیریت | پت‌شاپ',
  description: 'مدیریت محصولات، حیوانات، کاربران و تنظیمات پت‌شاپ',
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
