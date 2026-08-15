import type { Metadata } from 'next';

import { AuthLayoutShell } from '@/components/layouts/auth/auth-layout-shell';

export const metadata: Metadata = {
  title: {
    default: 'ورود به پت‌شاپ',
    template: '%s | پت‌شاپ',
  },
  description: 'ورود یا ساخت حساب کاربری پت‌شاپ',
};

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AuthLayoutShell>{children}</AuthLayoutShell>;
}
