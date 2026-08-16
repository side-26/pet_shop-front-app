import Link from 'next/link';

import { AuthFormCard } from '@/app/(auth)/_components/auth-form-card';
import { RegisterForm } from '@/app/(auth)/register/_components/register-form';
import { routePaths } from '@/configs/route.path';

export function RegisterView() {
  return (
    <AuthFormCard
      titleId="register-title"
      title="ثبت‌نام در پت‌شاپ"
      description="برای ساخت حساب کاربری شماره تلفن و کلمه عبور خود را وارد کنید"
      footer={
        <p className="tw:text-body-s tw:text-muted-foreground">
          حساب کاربری دارید؟{' '}
          <Link
            href={routePaths.login}
            className="tw:inline-flex tw:min-h-11 tw:items-center tw:rounded-lg tw:px-1 tw:font-medium tw:text-primary tw:outline-none tw:transition-colors tw:hover:text-primary-hover tw:focus-visible:ring-3 tw:focus-visible:ring-primary/25 tw:motion-reduce:transition-none"
          >
            ورود
          </Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthFormCard>
  );
}
