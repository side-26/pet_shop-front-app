import { KeyRoundIcon, UserRoundIcon } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { CurrentUserDTO } from '@/entities/users/users.dto';
import { cn } from '@/lib/utils';

import {
  AdminProfilePersonalInfoForm,
  AdminProfilePersonalInfoSubmit,
} from './admin-profile-personal-info-form';
import {
  AdminProfilePasswordForm,
  AdminProfilePasswordSubmit,
} from './admin-profile-password-form';

type Props = { user: CurrentUserDTO; isSkeleton?: boolean };

function ProfileCardSkeleton({ lines }: { lines: number }) {
  return (
    <div className="tw:flex tw:flex-col tw:gap-4" aria-hidden="true">
      {Array.from({ length: lines }, (_, index) => (
        <div key={index} className="tw:h-10 tw:rounded-xl tw:bg-muted" />
      ))}
    </div>
  );
}

export function AdminProfilePageContentRenderer({ user, isSkeleton = false }: Props) {
  return (
    <section
      aria-busy={isSkeleton || undefined}
      className={cn(
        'tw:mx-auto tw:flex tw:w-full tw:max-w-4xl tw:flex-col tw:gap-4 tw:sm:gap-6',
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      <div className="tw:flex tw:flex-col tw:gap-1">
        <h1 className="tw:text-heading-4 tw:text-foreground">پروفایل</h1>
        <p className="tw:text-body-m tw:text-muted-foreground">
          اطلاعات شخصی و تنظیمات امنیت حساب خود را مدیریت کنید.
        </p>
      </div>

      <Card size="lg" variant="elevated">
        <CardHeader>
          <CardTitle className="tw:flex tw:items-center tw:gap-2">
            <UserRoundIcon aria-hidden="true" className="tw:text-primary" />
            اطلاعات شخصی
          </CardTitle>
          <CardDescription>نام و تصویر پروفایل خود را به‌روز نگه دارید.</CardDescription>
        </CardHeader>
        <CardContent>
          {isSkeleton ? (
            <ProfileCardSkeleton lines={3} />
          ) : (
            <AdminProfilePersonalInfoForm user={user} />
          )}
        </CardContent>
        <CardFooter>
          <AdminProfilePersonalInfoSubmit isSkeleton={isSkeleton} />
        </CardFooter>
      </Card>

      <Card size="lg" variant="outlined">
        <CardHeader>
          <CardTitle className="tw:flex tw:items-center tw:gap-2">
            <KeyRoundIcon aria-hidden="true" className="tw:text-primary" />
            تغییر کلمه عبور
          </CardTitle>
          <CardDescription>برای حفظ امنیت حساب، یک کلمه عبور قوی انتخاب کنید.</CardDescription>
        </CardHeader>
        <CardContent>
          {isSkeleton ? <ProfileCardSkeleton lines={3} /> : <AdminProfilePasswordForm />}
        </CardContent>
        <CardFooter>
          <AdminProfilePasswordSubmit isSkeleton={isSkeleton} />
        </CardFooter>
      </Card>
    </section>
  );
}
