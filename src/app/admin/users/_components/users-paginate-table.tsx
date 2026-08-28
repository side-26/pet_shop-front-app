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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TablePagination } from '@/components/common/table-pagination';
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
  query?: Record<string, string>;
  isLoading?: boolean;
};

function getInitials(fullName: string) {
  return fullName
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('');
}

function displayValue(value: string) {
  return value.trim() || '_';
}

export function UsersPaginateTable({
  users,
  page,
  pageCount,
  total,
  query = {},
  isLoading = false,
}: UsersPaginateTableProps) {
  return (
    <section
      aria-busy={isLoading || undefined}
      className={cn(
        'tw:flex tw:h-10 tw:min-h-0 tw:flex-auto tw:flex-col tw:gap-4',
        isLoading && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      <div className="tw:min-h-0 tw:flex-1 tw:overflow-auto tw:rounded-2xl tw:border tw:border-border">
        <Table className="tw:h-full">
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
            {users.length ? (
              users.map((user) => {
                const role = rolePresentation[user.role];
                const fullName = displayValue(user.fullName);

                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarFallback>{getInitials(user.fullName) || '_'}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="tw:font-medium">{fullName}</TableCell>
                    <TableCell>
                      <bdi dir="ltr">{displayValue(user.phoneNumber)}</bdi>
                    </TableCell>
                    <TableCell>
                      <bdi dir="ltr">{displayValue(user.nationalCode)}</bdi>
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
                        checkedColor="success"
                        uncheckedColor="error"
                        aria-label={`${fullName}: ${user.isEnable ? 'فعال' : 'غیرفعال'}`}
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
                              aria-label={`عملیات ${fullName}`}
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
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="tw:h-full tw:text-center tw:text-muted-foreground"
                >
                  _
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        basePath={routePaths.adminUsers}
        query={query}
        page={page}
        pageCount={pageCount}
        total={total}
        itemCount={users.length}
        itemLabel="کاربر"
        limitOptions={[20, 40, 60, 100]}
        disabled={isLoading}
      />
    </section>
  );
}
