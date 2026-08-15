import type { ReactNode } from 'react';
import Image from 'next/image';
import { Headphones, PawPrint, ShieldCheck, Truck } from 'lucide-react';

import dogImage from '@/../public/images/auth/dog.png';

type AuthLayoutShellProps = Readonly<{
  children: ReactNode;
}>;

const benefits = [
  {
    title: 'محصولات باکیفیت',
    description: 'از برندهای معتبر',
    icon: ShieldCheck,
  },
  {
    title: 'ارسال سریع',
    description: 'به سراسر کشور',
    icon: Truck,
  },
  {
    title: 'پشتیبانی در کنار شما',
    description: 'مشاوره و راهنمایی تخصصی',
    icon: Headphones,
  },
] as const;

export function AuthLayoutShell({ children }: AuthLayoutShellProps) {
  return (
    <main className="tw:grid tw:min-h-svh tw:min-w-0 tw:overflow-x-hidden tw:bg-info-muted tw:text-foreground tw:lg:h-svh tw:lg:grid-cols-[minmax(0,1.08fr)_minmax(24rem,0.92fr)] tw:lg:overflow-hidden">
      <section
        aria-labelledby="auth-brand-title"
        className="tw:relative tw:isolate tw:min-h-72 tw:overflow-hidden tw:bg-info-muted tw:sm:min-h-[34rem] tw:lg:min-h-svh"
      >
        <div
          aria-hidden="true"
          className="tw:absolute tw:-start-28 tw:top-8 tw:size-72 tw:rounded-full tw:bg-card/60 tw:blur-3xl"
        />
        <div
          aria-hidden="true"
          className="tw:absolute tw:-end-28 tw:bottom-10 tw:h-56 tw:w-4/5 tw:rotate-6 tw:rounded-[50%] tw:bg-primary-muted/60"
        />
        <div
          aria-hidden="true"
          className="tw:absolute tw:-start-20 tw:-bottom-20 tw:size-64 tw:rounded-full tw:bg-accent-muted/70"
        />
        <PawPrint
          aria-hidden="true"
          className="tw:absolute tw:start-6 tw:top-7 tw:size-8 tw:-rotate-12 tw:text-info/20 tw:sm:start-10 tw:sm:top-12 tw:sm:size-11"
        />
        <PawPrint
          aria-hidden="true"
          className="tw:absolute tw:end-8 tw:bottom-12 tw:size-10 tw:rotate-12 tw:text-primary/20 tw:sm:end-12 tw:sm:size-14"
        />

        <div className="tw:relative tw:z-10 tw:mx-auto tw:flex tw:h-full tw:max-w-3xl tw:flex-col tw:items-center tw:px-4 tw:pt-[max(1.5rem,env(safe-area-inset-top))] tw:text-center tw:sm:px-8 tw:sm:pt-9 tw:lg:pt-[clamp(2.5rem,6vh,5rem)]">
          <div className="tw:flex tw:flex-col tw:items-center tw:gap-2">
            <div className="tw:flex tw:items-center tw:gap-2 tw:text-primary">
              <PawPrint aria-hidden="true" className="tw:size-9 tw:sm:size-11 tw:lg:size-14" />
              <p
                id="auth-brand-title"
                className="tw:text-heading-1 tw:font-extrabold tw:tracking-tight tw:sm:text-display-l"
              >
                پت‌شاپ
              </p>
            </div>
            <p className="tw:max-w-xl tw:text-body-s tw:font-medium tw:text-info-muted-foreground tw:sm:text-body-l">
              <span aria-hidden="true" className="tw:text-primary">
                •
              </span>{' '}
              همراه مطمئن دوست کوچولوی شما{' '}
              <span aria-hidden="true" className="tw:text-primary">
                •
              </span>
            </p>
          </div>

          <ul className="tw:mt-5 tw:grid tw:w-full tw:grid-cols-3 tw:gap-2 tw:sm:mt-8 tw:sm:gap-5 tw:lg:mt-[clamp(2rem,5vh,3.5rem)]">
            {benefits.map(({ title, description, icon: Icon }) => (
              <li key={title} className="tw:flex tw:min-w-0 tw:flex-col tw:items-center">
                <span className="tw:grid tw:size-11 tw:place-items-center tw:rounded-full tw:border tw:border-border/70 tw:bg-card/85 tw:text-info tw:shadow-md tw:shadow-foreground/5 tw:sm:size-16">
                  <Icon aria-hidden="true" className="tw:size-5 tw:sm:size-8" />
                </span>
                <strong className="tw:mt-2 tw:text-label-s tw:text-foreground tw:sm:mt-3 tw:sm:text-label-l">
                  {title}
                </strong>
                <span className="tw:hidden tw:text-body-s tw:text-muted-foreground tw:sm:block">
                  {description}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div
          aria-hidden="true"
          className="tw:absolute tw:inset-x-0 tw:bottom-0 tw:z-0 tw:hidden tw:h-[56%] tw:bg-accent-muted/45 tw:sm:block tw:lg:h-[48%]"
        />
        <Image
          src={dogImage}
          alt="توله‌سگ گلدن رتریور"
          width={335}
          height={520}
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 16rem, 0px"
          className="tw:absolute tw:bottom-0 tw:start-1/2 tw:z-10 tw:hidden tw:h-auto tw:w-56 tw:translate-x-1/2 tw:object-contain tw:drop-shadow-xl tw:sm:block tw:lg:start-[18%] tw:lg:w-[min(21rem,29vw)] tw:lg:translate-x-0"
        />
      </section>

      <section
        aria-label="محتوای احراز هویت"
        className="tw:relative tw:z-20 tw:flex tw:min-w-0 tw:items-end tw:justify-center tw:bg-transparent tw:p-0 tw:lg:h-svh tw:lg:items-center tw:lg:overflow-y-auto tw:lg:bg-background tw:lg:px-[clamp(2rem,5vw,4.5rem)] tw:lg:py-10"
      >
        <div className="tw:w-full tw:max-w-none tw:lg:max-w-xl">{children}</div>
      </section>
    </main>
  );
}
