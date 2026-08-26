import Link from 'next/link';

import { AuthFormCard } from '@/app/(auth)/_components/auth-form-card';
import { LoginForm } from '@/app/(auth)/login/_components/login-form';
import { LogoutSuccessMessage } from '@/app/(auth)/login/_components/logout-success-message';
import { routePaths } from '@/configs/route.path';

export function LoginMobileView() {
  return (
    <>
      <LogoutSuccessMessage />
      <AuthFormCard
        titleId="login-title"
        title="ورود به پت‌شاپ"
        description="برای بهره مندی از امکانات بیشتر اپلیکیشن شماره تلفن و کلمه عبور خود را وارد کنید"
        footer={
          <p className="tw:text-body-s tw:text-muted-foreground">
            حساب کاربری ندارید؟{' '}
            <Link
              href={routePaths.register}
              className="tw:inline-flex tw:min-h-11 tw:items-center tw:rounded-lg tw:px-1 tw:font-medium tw:text-primary tw:outline-none tw:transition-colors tw:hover:text-primary-hover tw:focus-visible:ring-3 tw:focus-visible:ring-primary/25 tw:motion-reduce:transition-none"
            >
              ثبت‌نام
            </Link>
          </p>
        }
      >
        <LoginForm />
      </AuthFormCard>
    </>
  );
}
