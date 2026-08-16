import type { Metadata } from 'next';

import { RegisterView } from '@/app/(auth)/register/_components/register-view';

export const metadata: Metadata = {
  title: 'ثبت‌نام',
  description: 'ساخت حساب کاربری پت‌شاپ با شماره موبایل و رمز عبور',
};

export default function RegisterPage() {
  return <RegisterView />;
}
