import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'ورود به پت‌شاپ',
    template: '%s | پت‌شاپ',
  },
  description: 'ورود یا ساخت حساب کاربری پت‌شاپ',
};

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <main>{children}</main>;
}
