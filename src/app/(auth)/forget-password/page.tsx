import type { Metadata } from 'next';

import { ForgetPasswordView } from '@/app/(auth)/forget-password/_components/forget-password-view';

export const metadata: Metadata = {
  title: 'فراموشی کلمه عبور',
  description: 'بازیابی کلمه عبور حساب کاربری پت‌شاپ با شماره موبایل',
};

export default function ForgetPasswordPage() {
  return <ForgetPasswordView />;
}
