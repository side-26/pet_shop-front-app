'use client';

import { Suspense, use } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { USER_ROLES, type UserRole } from '@/configs/user-role';
import { userGetDetailByIdAction } from '@/entities/users/users.actions';
import type { AddressDTO, UserDetailDTO } from '@/entities/users/users.dto';
import { cn } from '@/lib/utils';

const rolePresentation = {
  [USER_ROLES.ADMIN]: { label: 'مدیر', color: 'primary' },
  [USER_ROLES.SELLER]: { label: 'فروشنده', color: 'secondary' },
  [USER_ROLES.CUSTOMER]: { label: 'مشتری', color: 'neutral' },
} as const satisfies Record<UserRole, { label: string; color: NonNullable<BadgeProps['color']> }>;

const skeletonUser: UserDetailDTO = {
  _id: '________________________',
  firstName: 'نام کاربر',
  lastName: 'نام خانوادگی',
  phoneNumber: '09123456789',
  email: 'user@example.com',
  isEnable: true,
  avatar: '',
  nationalCode: '0012345678',
  addresses: [],
  age: 30,
  role: USER_ROLES.CUSTOMER,
  orders: [],
  cart: {
    totalPrice: 0,
    items: [],
    discountPrice: 0,
    userAddress: null,
    deliveringDateToShipping: null,
    shippingPrice: 0,
    shippingInfo: { name: '', trackingCode: '', estimateDeliveryDate: null },
    paymentType: 0,
    instalmentCompany: null,
  },
  wishlist: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

type UserInfoDialogProps = {
  userName: string;
  userRequest: ReturnType<typeof userGetDetailByIdAction>;
  onClose: () => void;
};

type UserInfoRendererProps = {
  user?: UserDetailDTO;
  errorMessage?: string | null;
  isSkeleton?: boolean;
};

function displayValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || String(value).trim() === '') return '_';
  return String(value);
}

function getInitials(user: UserDetailDTO) {
  return `${user.firstName.at(0) ?? ''}${user.lastName.at(0) ?? ''}` || '_';
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '_' : new Intl.DateTimeFormat('fa-IR').format(date);
}

function InfoItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="tw:flex tw:min-w-0 tw:flex-col tw:gap-1">
      <dt className="tw:text-label-s tw:text-muted-foreground">{label}</dt>
      <dd className="tw:text-body-m tw:font-medium">{children}</dd>
    </div>
  );
}

function AddressCard({ address, index }: { address: AddressDTO; index: number }) {
  const receiverName = `${address.firstName} ${address.lastName}`.trim();

  return (
    <Card size="sm" variant="outlined">
      <CardHeader>
        <CardTitle>نشانی {index + 1}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="tw:grid tw:grid-cols-1 tw:gap-4 tw:sm:grid-cols-2">
          <InfoItem label="نشانی">
            {displayValue(`${address.province}، ${address.city}، ${address.detailAddress}`)}
          </InfoItem>
          <InfoItem label="پلاک / واحد">
            <bdi dir="ltr">
              {displayValue(`${address.plate}${address.unit ? ` / ${address.unit}` : ''}`)}
            </bdi>
          </InfoItem>
          <InfoItem label="کد پستی">
            <bdi dir="ltr">{displayValue(address.postalCode)}</bdi>
          </InfoItem>
          <InfoItem label="تحویل‌گیرنده">{displayValue(receiverName)}</InfoItem>
          <InfoItem label="شماره موبایل تحویل‌گیرنده">
            <bdi dir="ltr">{displayValue(address.phoneNumber)}</bdi>
          </InfoItem>
          <InfoItem label="کد ملی تحویل‌گیرنده">
            <bdi dir="ltr">{displayValue(address.nationalCode)}</bdi>
          </InfoItem>
        </dl>
      </CardContent>
    </Card>
  );
}

export function UserInfoRenderer({
  user,
  errorMessage,
  isSkeleton = false,
}: UserInfoRendererProps) {
  const renderedUser = user ?? skeletonUser;
  const fullName = `${renderedUser.firstName} ${renderedUser.lastName}`.trim();
  const role = rolePresentation[renderedUser.role];

  if (errorMessage) {
    return (
      <Card variant="outlined" size="sm" role="alert">
        <CardHeader>
          <CardTitle>دریافت اطلاعات کاربر انجام نشد</CardTitle>
        </CardHeader>
        <CardContent className="tw:text-error">{errorMessage}</CardContent>
      </Card>
    );
  }

  return (
    <div
      aria-busy={isSkeleton || undefined}
      className={cn(
        'tw:flex tw:flex-col tw:gap-4',
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      <Card size="sm" variant="filled">
        <CardContent className="tw:flex tw:items-center tw:gap-4">
          <Avatar size="lg">
            {renderedUser.avatar ? (
              <AvatarImage src={renderedUser.avatar} alt={`تصویر ${fullName}`} />
            ) : null}
            <AvatarFallback>{getInitials(renderedUser)}</AvatarFallback>
          </Avatar>
          <div className="tw:flex tw:min-w-0 tw:flex-1 tw:flex-col tw:gap-2">
            <p className="tw:truncate tw:text-title-m tw:font-medium">{displayValue(fullName)}</p>
            <div className="tw:flex tw:flex-wrap tw:gap-2">
              <Badge color={role.color} variant="tonal">
                {role.label}
              </Badge>
              <Badge color={renderedUser.isEnable ? 'success' : 'error'} variant="tonal">
                {renderedUser.isEnable ? 'فعال' : 'غیرفعال'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card size="sm" variant="outlined">
        <CardHeader>
          <CardTitle>اطلاعات فردی و تماس</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="tw:grid tw:grid-cols-1 tw:gap-4 tw:sm:grid-cols-2">
            <InfoItem label="شماره موبایل">
              <bdi dir="ltr">{displayValue(renderedUser.phoneNumber)}</bdi>
            </InfoItem>
            <InfoItem label="ایمیل">
              <bdi dir="ltr">{displayValue(renderedUser.email)}</bdi>
            </InfoItem>
            <InfoItem label="کد ملی">
              <bdi dir="ltr">{displayValue(renderedUser.nationalCode)}</bdi>
            </InfoItem>
            <InfoItem label="سن">{displayValue(renderedUser.age)}</InfoItem>
            <InfoItem label="تاریخ عضویت">{formatDate(renderedUser.createdAt)}</InfoItem>
            <InfoItem label="آخرین به‌روزرسانی">{formatDate(renderedUser.updatedAt)}</InfoItem>
          </dl>
        </CardContent>
      </Card>

      <Card size="sm" variant="outlined">
        <CardHeader>
          <CardTitle>فعالیت حساب</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="tw:grid tw:grid-cols-3 tw:gap-4">
            <InfoItem label="سفارش‌ها">
              {renderedUser.orders.length.toLocaleString('fa-IR')}
            </InfoItem>
            <InfoItem label="علاقه‌مندی‌ها">
              {renderedUser.wishlist.length.toLocaleString('fa-IR')}
            </InfoItem>
            <InfoItem label="سبد خرید">
              {renderedUser.cart.items.length.toLocaleString('fa-IR')}
            </InfoItem>
          </dl>
        </CardContent>
      </Card>

      {renderedUser.addresses.length ? (
        <section aria-labelledby="user-addresses-title" className="tw:flex tw:flex-col tw:gap-3">
          <h3 id="user-addresses-title" className="tw:text-title-s">
            نشانی‌ها
          </h3>
          {renderedUser.addresses.map((address, index) => (
            <AddressCard key={`${address.postalCode}-${index}`} address={address} index={index} />
          ))}
        </section>
      ) : (
        <Card size="sm" variant="outlined">
          <CardHeader>
            <CardTitle>نشانی‌ها</CardTitle>
          </CardHeader>
          <CardContent className="tw:text-muted-foreground">
            نشانی ثبت‌شده‌ای وجود ندارد.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function UserInfoContainer({ userRequest }: Pick<UserInfoDialogProps, 'userRequest'>) {
  const result = use(userRequest);

  if (!result.isSuccess) {
    return <UserInfoRenderer errorMessage={result.message ?? 'خطایی در دریافت اطلاعات رخ داد.'} />;
  }

  return <UserInfoRenderer user={result.data} />;
}

export function UserInfoDialog({ userName, userRequest, onClose }: UserInfoDialogProps) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        size="xl"
        className="tw:max-h-[calc(100dvh-2rem)] tw:grid-rows-[auto_minmax(0,1fr)] tw:overflow-hidden"
      >
        <DialogHeader className="tw:pe-10">
          <DialogTitle>اطلاعات کاربر</DialogTitle>
          <DialogDescription>مشخصات و فعالیت حساب {userName}</DialogDescription>
        </DialogHeader>
        <div className="tw:min-h-0 tw:overflow-y-auto tw:overscroll-contain">
          <Suspense fallback={<UserInfoRenderer isSkeleton />}>
            <UserInfoContainer userRequest={userRequest} />
          </Suspense>
        </div>
      </DialogContent>
    </Dialog>
  );
}
