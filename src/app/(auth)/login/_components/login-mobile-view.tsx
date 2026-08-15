import Link from 'next/link';

import { cn } from '@/lib/utils';

import { LoginForm } from '@/app/(auth)/login/_components/login-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';

export function LoginMobileView() {
  return (
    <main
      className={cn(
        'tw:flex tw:min-h-svh tw:flex-col tw:min-w-0 tw:items-center tw:justify-end tw:bg-top tw:bg-clip-border tw:bg-origin-content tw:bg-no-repeat tw:bg-contain tw:overflow-hidden tw:text-foreground',
        `tw:bg-[image:url(/images/auth/login-bg-mobile.png)]`,
      )}
    >
      <section
        aria-labelledby="login-title"
        className="tw:relative tw:flex tw:h-fit tw:w-full tw:max-w-md tw:flex-none tw:items-end tw:overflow-hidden tw:sm:rounded-4xl tw:sm:border"
      >
        <div aria-hidden="true" className="tw:absolute tw:inset-0 tw:bg-background/15" />

        <Card
          variant="glass"
          size="xs"
          className="tw:relative tw:gap-3 tw:rounded-t-4xl tw:rounded-b-none tw:border-border-strong tw:bg-card/85 tw:py-3 tw:[@media(max-height:430px)]:gap-1.5 tw:[@media(max-height:430px)]:rounded-3xl tw:size-full tw:[@media(max-height:430px)]:py-2"
        >
          <CardHeader className="tw:gap-1 tw:text-center">
            <h1 id="login-title" className="tw:text-heading-3 tw:text-card-foreground">
              ورود به پت‌شاپ
            </h1>
            <CardDescription className="tw:[@media(max-height:430px)]:hidden">
              همراه مطمئن برای مراقبت از دوست کوچولوی شما
            </CardDescription>
          </CardHeader>

          <CardContent>
            <LoginForm />
          </CardContent>

          <CardFooter className="tw:justify-center tw:border-t tw:border-border/70 tw:text-center tw:[@media(max-height:430px)]:pt-1.5">
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
    </main>
  );
}
