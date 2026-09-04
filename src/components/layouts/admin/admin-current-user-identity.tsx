import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { USER_ROLES, type UserRole } from '@/configs/user-role';
import type { CurrentUserDTO } from '@/entities/users/users.dto';
import { cn } from '@/lib/utils';

const roleLabels: Record<UserRole, string> = {
  [USER_ROLES.ADMIN]: 'مدیر',
  [USER_ROLES.SELLER]: 'فروشنده',
  [USER_ROLES.CUSTOMER]: 'مشتری',
};

type Props = {
  user: CurrentUserDTO;
  isSkeleton?: boolean;
};

export function AdminCurrentUserIdentity({ user, isSkeleton = false }: Props) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.phoneNumber;

  return (
    <div
      aria-busy={isSkeleton || undefined}
      className={cn('tw:contents', isSkeleton && 'skeleton tw:pointer-events-none tw:select-none')}
      data-slot="admin-current-user-identity"
    >
      <Avatar size="lg">
        {user.avatar ? <AvatarImage src={user.avatar} alt={`تصویر پروفایل ${fullName}`} /> : null}
        <AvatarFallback className="tw:bg-primary-muted tw:font-bold tw:text-primary">
          {fullName.slice(0, 1) || '_'}
        </AvatarFallback>
      </Avatar>
      <div className="tw:min-w-0 tw:flex-1 tw:transition-[opacity,transform] tw:duration-200 tw:motion-reduce:transition-none tw:group-data-[collapsed=true]/admin-identity:pointer-events-none tw:group-data-[collapsed=true]/admin-identity:absolute tw:group-data-[collapsed=true]/admin-identity:translate-x-2 tw:group-data-[collapsed=true]/admin-identity:opacity-0">
        <p className="tw:truncate tw:text-label-m tw:font-bold tw:text-sidebar-foreground">
          {fullName}
        </p>
        <p className="tw:truncate tw:text-label-s tw:text-muted-foreground">
          {roleLabels[user.role]}
        </p>
      </div>
    </div>
  );
}
