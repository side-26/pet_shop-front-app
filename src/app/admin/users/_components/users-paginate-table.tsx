import { EyeIcon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/fields/switch';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { USER_ROLES, type UserRole } from '@/configs/user-role';
import { routePaths } from '@/configs/route.path';
import { cn } from '@/lib/utils';

import type { UserTableRow } from './users-table.types';

const rolePresentation = {
  [USER_ROLES.ADMIN]: { label: 'مدیر', color: 'primary' },
  [USER_ROLES.SELLER]: { label: 'فروشنده', color: 'secondary' },
  [USER_ROLES.CUSTOMER]: { label: 'مشتری', color: 'neutral' },
} as const satisfies Record<UserRole, { label: string; color: NonNullable<BadgeProps['color']> }>;

type UsersPaginateTableProps = {
  users: UserTableRow[];
  page: number;
  pageCount: number;
  total: number;
  isLoading?: boolean;
};

function getInitials(fullName: string) {
  return fullName
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('');
}

export function UsersPaginateTable({
  users,
  page,
  pageCount,
  total,
  isLoading = false,
}: UsersPaginateTableProps) {
  return (
    <section
      aria-label="فهرست کاربران"
      aria-busy={isLoading || undefined}
      className={cn(
        'tw:flex tw:min-h-0 tw:flex-1 tw:flex-col tw:gap-4',
        isLoading && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      <div className="tw:overflow-hidden tw:rounded-2xl tw:border tw:border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="tw:w-16">تصویر</TableHead>
              <TableHead>نام و نام خانوادگی</TableHead>
              <TableHead>شماره موبایل</TableHead>
              <TableHead>کد ملی</TableHead>
              <TableHead>نقش</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead className="tw:w-16">
                <span className="tw:sr-only">عملیات</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const role = rolePresentation[user.role];

              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="tw:font-medium">{user.fullName}</TableCell>
                  <TableCell>
                    <bdi dir="ltr">{user.phoneNumber}</bdi>
                  </TableCell>
                  <TableCell>
                    <bdi dir="ltr">{user.nationalCode}</bdi>
                  </TableCell>
                  <TableCell>
                    <Badge color={role.color} variant="tonal">
                      {role.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={user.isEnable}
                      readOnly
                      disabled={isLoading}
                      size="sm"
                      aria-label={`${user.fullName}: ${user.isEnable ? 'فعال' : 'غیرفعال'}`}
                    />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        disabled={isLoading}
                        render={
                          <Button
                            type="button"
                            iconOnly
                            size="sm"
                            variant="flat"
                            color="secondary"
                            aria-label={`عملیات ${user.fullName}`}
                          />
                        }
                      >
                        <MoreHorizontalIcon aria-hidden="true" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <EyeIcon aria-hidden="true" />
                            مشاهده اطلاعات کاربر
                          </DropdownMenuItem>
                          <DropdownMenuItem variant="destructive">
                            <Trash2Icon aria-hidden="true" />
                            حذف کاربر
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <footer className="tw:flex tw:flex-col tw:items-center tw:justify-between tw:gap-3 tw:px-1 tw:sm:flex-row">
        <p className="tw:text-body-s tw:text-muted-foreground">
          نمایش {users.length} کاربر از {total}
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={routePaths.adminUsersPage(Math.max(1, page - 1))}
                aria-disabled={page <= 1 || isLoading}
                className={cn((page <= 1 || isLoading) && 'tw:pointer-events-none tw:opacity-50')}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href={routePaths.adminUsersPage(page)} isActive>
                {page}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href={routePaths.adminUsersPage(Math.min(pageCount, page + 1))}
                aria-disabled={page >= pageCount || isLoading}
                className={cn(
                  (page >= pageCount || isLoading) && 'tw:pointer-events-none tw:opacity-50',
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </footer>
    </section>
  );
}
