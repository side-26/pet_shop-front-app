import Link from 'next/link';

import { LoginForm } from '@/app/(auth)/login/_components/login-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';

export function LoginMobileView() {
  return (
    <div className="tw:flex tw:min-w-0 tw:items-center tw:justify-center tw:text-foreground">
      <section
        aria-labelledby="login-title"
        className="tw:relative tw:flex tw:h-fit tw:w-full tw:max-w-md tw:flex-none tw:items-end tw:overflow-hidden tw:sm:max-lg:max-w-none tw:sm:max-lg:rounded-t-4xl tw:sm:max-lg:rounded-b-none tw:sm:max-lg:border"
      >
        <div aria-hidden="true" className="tw:absolute tw:inset-0 tw:bg-background/15" />

        <Card
          variant="glass"
          size="xs"
          className="tw:relative tw:size-full tw:gap-3 tw:rounded-t-4xl tw:rounded-b-none tw:border-border-strong tw:bg-card/85 tw:py-3 tw:sm:max-lg:rounded-t-4xl tw:sm:max-lg:rounded-b-none tw:[@media(max-height:430px)]:gap-1.5 tw:[@media(max-height:430px)]:rounded-t-3xl tw:[@media(max-height:430px)]:rounded-b-none tw:[@media(max-height:430px)]:py-2 tw:[@media(min-width:1025px)]:rounded-b-4xl"
        >
          <CardHeader className="tw:gap-1 tw:text-center tw:sm:max-lg:mx-auto tw:sm:max-lg:w-full tw:sm:max-lg:max-w-[430px]">
            <h1 id="login-title" className="tw:text-heading-3 tw:text-card-foreground">
              ورود به پت‌شاپ
            </h1>
            <CardDescription className="tw:[@media(max-height:430px)]:hidden">
              برای بهره مندی از امکانات بیشتر اپلیکیشن شماره تلفن و کلمه عبور خود را وارد کنید
            </CardDescription>
          </CardHeader>

          <CardContent className="tw:sm:max-lg:mx-auto tw:sm:max-lg:w-full tw:sm:max-lg:max-w-[430px]">
            <LoginForm />
          </CardContent>

          <CardFooter className="tw:justify-center tw:border-t tw:border-border/70 tw:text-center tw:sm:max-lg:mx-auto tw:sm:max-lg:w-full tw:sm:max-lg:max-w-[430px] tw:[@media(max-height:430px)]:pt-1.5">
            <p className="tw:text-body-s tw:text-muted-foreground">
              حساب کاربری ندارید؟{' '}
              <Link
                href="/register"
                className="tw:inline-flex tw:min-h-11 tw:items-center tw:rounded-lg tw:px-1 tw:font-medium tw:text-primary tw:outline-none tw:transition-colors tw:hover:text-primary-hover tw:focus-visible:ring-3 tw:focus-visible:ring-primary/25 tw:motion-reduce:transition-none"
              >
                ثبت‌نام
              </Link>
            </p>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
