import { CalendarDays, CircleCheck, PackageCheck, UserRound } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

import { ProfileTabs } from './profile-tabs';

export function ProfilePageContent() {
  return (
    <div className="tw:relative tw:overflow-hidden tw:py-8 tw:sm:py-10 tw:lg:py-14 tw:lg:[--text-heading-3:1.25rem] tw:lg:[--text-title-l:1.125rem] tw:lg:[--text-title-m:1rem] tw:lg:[--text-title-s:0.9375rem] tw:lg:[--text-body-m:0.9375rem] tw:lg:[--text-body-s:0.8125rem] tw:lg:[--text-label-l:0.9375rem] tw:lg:[--text-label-m:0.8125rem]">
      <div
        aria-hidden="true"
        className="tw:pointer-events-none tw:absolute tw:inset-x-0 tw:top-0 tw:-z-10 tw:h-80 tw:bg-[radial-gradient(circle_at_top_right,var(--primary-muted),transparent_58%)] tw:opacity-75"
      />
      <div className="tw:mx-auto tw:flex tw:w-full tw:max-w-7xl tw:flex-col tw:gap-6 tw:px-4 tw:sm:gap-8 tw:sm:px-6 tw:lg:px-8">
        <Card variant="glass" size="lg">
          <CardContent className="tw:grid tw:items-center tw:gap-6 tw:md:grid-cols-[minmax(0,1fr)_auto] tw:lg:gap-10">
            <div className="tw:flex tw:min-w-0 tw:flex-col tw:items-center tw:gap-4 tw:text-center tw:sm:flex-row tw:sm:text-start">
              <span
                aria-hidden="true"
                className="tw:flex tw:size-20 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-3xl tw:bg-primary tw:text-primary-foreground tw:shadow-lg tw:shadow-primary/20 tw:sm:size-24"
              >
                <UserRound className="tw:size-9 tw:sm:size-11" />
              </span>
              <div className="tw:flex tw:min-w-0 tw:flex-col tw:gap-1.5">
                <div className="tw:flex tw:flex-wrap tw:items-center tw:justify-center tw:gap-2 tw:sm:justify-start">
                  <h1 className="tw:text-heading-3 tw:text-card-foreground">نیلوفر احمدی</h1>
                  <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-label-m tw:text-success">
                    <CircleCheck className="tw:size-4" aria-hidden="true" />
                    حساب تأییدشده
                  </span>
                </div>
                <bdi dir="ltr" className="tw:truncate tw:text-body-m tw:text-muted-foreground">
                  niloofar.ahmadi@example.com
                </bdi>
                <p className="tw:text-body-s tw:text-muted-foreground">
                  عضو پناهگاه پرشین از سال ۱۴۰۲
                </p>
              </div>
            </div>

            <dl className="tw:grid tw:grid-cols-2 tw:gap-3 tw:sm:grid-cols-3 tw:md:min-w-[360px]">
              <div className="tw:flex tw:flex-col tw:gap-1 tw:rounded-2xl tw:bg-primary-muted tw:p-4">
                <dt className="tw:flex tw:items-center tw:gap-1.5 tw:text-label-m tw:text-primary-muted-foreground">
                  <PackageCheck className="tw:size-4" aria-hidden="true" />
                  سفارش‌ها
                </dt>
                <dd className="tw:text-title-l tw:text-primary-muted-foreground">۱۲</dd>
              </div>
              <div className="tw:flex tw:flex-col tw:gap-1 tw:rounded-2xl tw:bg-success-muted tw:p-4">
                <dt className="tw:flex tw:items-center tw:gap-1.5 tw:text-label-m tw:text-success-muted-foreground">
                  <CircleCheck className="tw:size-4" aria-hidden="true" />
                  تحویل‌شده
                </dt>
                <dd className="tw:text-title-l tw:text-success-muted-foreground">۹</dd>
              </div>
              <div className="tw:col-span-2 tw:flex tw:flex-col tw:gap-1 tw:rounded-2xl tw:bg-info-muted tw:p-4 tw:sm:col-span-1">
                <dt className="tw:flex tw:items-center tw:gap-1.5 tw:text-label-m tw:text-info-muted-foreground">
                  <CalendarDays className="tw:size-4" aria-hidden="true" />
                  آخرین خرید
                </dt>
                <dd className="tw:text-title-s tw:text-info-muted-foreground">۱۸ مرداد</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <ProfileTabs />
      </div>
    </div>
  );
}
