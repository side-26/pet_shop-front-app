import { MapPin, Phone, UserRound } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import type { ProfileAddressDTO } from '@/entities/profile/profile.dto';
import { cn } from '@/lib/utils';

import { CreateNewAddressButton } from './create-new-address-button';

type Props = Readonly<{ addresses: readonly ProfileAddressDTO[]; isSkeleton?: boolean }>;

function addressTitle(address: ProfileAddressDTO) {
  return [address.province, address.city].filter(Boolean).join('، ') || 'نشانی تحویل';
}

function addressDetails(address: ProfileAddressDTO) {
  return [
    address.city,
    address.detailAddress,
    address.plate ? `پلاک ${address.plate}` : null,
    address.unit ? `واحد ${address.unit}` : null,
  ]
    .filter(Boolean)
    .join('، ');
}

function AddAddressButton() {
  return <CreateNewAddressButton />;
}

export function ProfileAddressesRenderer({ addresses, isSkeleton = false }: Props) {
  return (
    <section
      aria-busy={isSkeleton || undefined}
      aria-labelledby="addresses-heading"
      className={cn(
        'tw:flex tw:flex-col tw:gap-4',
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      <div className="tw:flex tw:flex-col tw:gap-1">
        <h2 id="addresses-heading" className="tw:text-title-l">
          نشانی‌های من
        </h2>
        <p className="tw:text-body-m tw:text-muted-foreground">
          محل‌های تحویل سفارش را مشاهده کنید.
        </p>
      </div>

      {isSkeleton ? (
        <div className="tw:grid tw:gap-4 tw:md:grid-cols-2" aria-hidden="true">
          {addresses.map((_, index) => (
            <Card key={index} size="md" variant="outlined">
              <CardHeader>
                <CardTitle className="tw:h-6 tw:w-40 tw:rounded tw:bg-muted" />
              </CardHeader>
              <CardContent className="tw:flex tw:flex-col tw:gap-3">
                <div className="tw:h-16 tw:rounded tw:bg-muted" />
                <div className="tw:h-4 tw:w-2/3 tw:rounded tw:bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <Empty className="tw:border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MapPin aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle role="heading" aria-level={3}>
              هنوز نشانی تحویلی ثبت نکرده‌اید
            </EmptyTitle>
            <EmptyDescription>
              اولین نشانی را اضافه کنید تا برای سفارش‌های بعدی آماده باشد.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <AddAddressButton />
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <div className="tw:grid tw:gap-4 tw:md:grid-cols-2">
            {addresses.map((address, index) => (
              <Card
                key={address._id ?? `${address.postalCode}-${index}`}
                size="md"
                variant="outlined"
              >
                <CardHeader>
                  <CardTitle className="tw:flex tw:items-center tw:gap-2">
                    <MapPin aria-hidden="true" />
                    {addressTitle(address)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="tw:flex tw:flex-col tw:gap-4">
                  <p className="tw:text-body-m tw:leading-8">{addressDetails(address)}</p>
                  <dl className="tw:grid tw:gap-2 tw:text-body-s tw:text-muted-foreground tw:sm:grid-cols-2">
                    <div className="tw:flex tw:items-center tw:gap-2">
                      <UserRound aria-hidden="true" />
                      <dt className="tw:sr-only">گیرنده</dt>
                      <dd>{`${address.firstName} ${address.lastName}`.trim()}</dd>
                    </div>
                    <div className="tw:flex tw:items-center tw:gap-2">
                      <Phone aria-hidden="true" />
                      <dt className="tw:sr-only">شماره تماس</dt>
                      <dd>
                        <bdi dir="ltr">{address.phoneNumber}</bdi>
                      </dd>
                    </div>
                    <div className="tw:sm:col-span-2">
                      <dt className="tw:inline">کد پستی: </dt>
                      <dd className="tw:inline">
                        <bdi dir="ltr">{address.postalCode}</bdi>
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="tw:flex tw:justify-center tw:pt-2">
            <AddAddressButton />
          </div>
        </>
      )}
    </section>
  );
}
