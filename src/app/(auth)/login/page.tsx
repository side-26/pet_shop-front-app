import type { Metadata } from 'next';

import { LoginMobileView } from '@/app/(auth)/login/_components/login-mobile-view';

export const metadata: Metadata = {
  title: 'ورود',
  description: 'ورود به حساب کاربری پت‌شاپ با شماره موبایل و رمز عبور',
};

export default function LoginPage() {
  return <LoginMobileView />;
}
