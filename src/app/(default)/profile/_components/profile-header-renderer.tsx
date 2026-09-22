'use client';

import { CalendarDays, CircleCheck, PackageCheck } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import type { ProfileAccountDTO } from '@/entities/profile/profile.dto';
import { cn } from '@/lib/utils';

import { ProfileAvatarField } from './profile-avatar-field';

type Props = { user: ProfileAccountDTO; isSkeleton?: boolean };

export function ProfileHeaderRenderer({ user, isSkeleton = false }: Props) {
  const fullName = `${user.firstName} ${user.lastName}`.trim();

  return (
    <Card
      variant="glass"
      size="lg"
      aria-busy={isSkeleton || undefined}
      className={cn(isSkeleton && 'skeleton tw:pointer-events-none tw:select-none')}
    >
      <CardContent className="tw:grid tw:items-center tw:gap-6 tw:md:grid-cols-[minmax(0,1fr)_auto] tw:lg:gap-10">
        <div className="tw:flex tw:min-w-0 tw:flex-col tw:items-center tw:gap-4 tw:text-center tw:sm:flex-row tw:sm:text-start">
          <div className="tw:w-auto tw:shrink-0">
            {isSkeleton ? (
              <div className="tw:size-16 tw:rounded-full tw:bg-muted" />
            ) : (
              <ProfileAvatarField user={user} />
            )}
          </div>
          <div className="tw:flex tw:min-w-0 tw:flex-col tw:gap-1.5">
            <h1 className="tw:text-heading-3 tw:text-card-foreground">
              {isSkeleton ? '—' : fullName}
            </h1>
            <bdi dir="ltr" className="tw:truncate tw:text-body-m tw:text-muted-foreground">
              {isSkeleton ? '—' : user.email}
            </bdi>
            <p className="tw:text-body-s tw:text-muted-foreground">عضو پت شاپ پرشین</p>
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
  );
}
