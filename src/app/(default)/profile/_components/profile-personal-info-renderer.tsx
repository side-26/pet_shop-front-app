'use client';

import { AlertCircle, UserRound } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProfileAccountDTO } from '@/entities/profile/profile.dto';
import { cn } from '@/lib/utils';

import { ProfilePersonalInfoForm } from './profile-personal-info-form';

type Props = { user: ProfileAccountDTO; isSkeleton?: boolean; errorMessage?: string };

function PersonalInfoSkeleton() {
  return (
    <div className="tw:grid tw:gap-4 tw:md:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="tw:h-12 tw:rounded-xl tw:bg-muted" />
      ))}
    </div>
  );
}

export function ProfilePersonalInfoRenderer({ user, isSkeleton = false, errorMessage }: Props) {
  return (
    <Card
      variant="outlined"
      size="lg"
      aria-busy={isSkeleton || undefined}
      className={cn(isSkeleton && 'skeleton tw:pointer-events-none tw:select-none')}
    >
      <CardHeader>
        <CardTitle className="tw:flex tw:items-center tw:gap-2">
          <UserRound aria-hidden="true" />
          اطلاعات شخصی
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isSkeleton ? (
          <PersonalInfoSkeleton />
        ) : errorMessage ? (
          <p role="alert" className="tw:flex tw:items-center tw:gap-2 tw:text-error">
            <AlertCircle aria-hidden="true" />
            دریافت اطلاعات پروفایل ناموفق بود: {errorMessage}
          </p>
        ) : (
          <ProfilePersonalInfoForm user={user} />
        )}
      </CardContent>
    </Card>
  );
}
