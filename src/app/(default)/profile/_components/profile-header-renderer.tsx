'use client';

import type { ProfileAccountDTO } from '@/entities/profile/profile.dto';
import { cn } from '@/lib/utils';

import { ProfileAvatarField } from './profile-avatar-field';

type Props = {
  user: ProfileAccountDTO;
  isSkeleton?: boolean;
};

export function ProfileHeaderRenderer({ user, isSkeleton = false }: Props) {
  const fullName = `${user.firstName} ${user.lastName}`.trim();

  return (
    <div
      aria-busy={isSkeleton || undefined}
      className={cn(
        'tw:flex tw:min-w-0 tw:flex-col tw:items-center tw:gap-4 tw:text-center tw:sm:flex-row tw:sm:text-start',
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      <div className="tw:w-auto tw:shrink-0">
        {isSkeleton ? (
          <div className="tw:size-16 tw:rounded-full tw:bg-muted" />
        ) : (
          <ProfileAvatarField user={user} />
        )}
      </div>
      <div className="tw:flex tw:min-w-0 tw:flex-col tw:gap-1.5">
        <h1 className="tw:text-heading-3 tw:text-card-foreground">{isSkeleton ? '—' : fullName}</h1>
        <bdi dir="ltr" className="tw:truncate tw:text-body-m tw:text-muted-foreground">
          {isSkeleton ? '—' : user.email}
        </bdi>
        <p className="tw:text-body-s tw:text-muted-foreground">عضو پت شاپ پرشین</p>
      </div>
    </div>
  );
}
