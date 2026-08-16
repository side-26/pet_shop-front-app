import type { Metadata } from 'next';

import { LoginMobileView } from '@/app/(auth)/login/_components/login-view';

export const metadata: Metadata = {
  title: 'ورود',
  description: 'ورود به حساب کاربری پت‌شاپ با شماره موبایل و کلمه عبور',
};

export default function LoginPage() {
  return <LoginMobileView />;
}
