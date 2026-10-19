import { MapPin, Phone, UserRound } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProfileAddressCardDTO } from '@/entities/profile/profile.dto';

import { ProfileAddressCardActions } from './profile-address-card-actions';

type Props = Readonly<{
  address: ProfileAddressCardDTO;
  isSkeleton?: boolean;
}>;

export function ProfileAddressCard({ address, isSkeleton = false }: Props) {
  return (
    <Card size="sm" variant="outlined">
      <CardHeader className="tw:flex tw:items-center tw:justify-between">
        <CardTitle className="tw:flex tw:items-center tw:gap-2">
          <MapPin aria-hidden="true" />
          {address.title}
        </CardTitle>
        <ProfileAddressCardActions
          addressId={address.id}
          addressTitle={address.title}
          disabled={isSkeleton}
        />
      </CardHeader>
      <CardContent className="tw:flex tw:flex-col tw:gap-3">
        <p className="tw:text-body-m tw:leading-7">{address.details}</p>
        <dl className="tw:grid tw:gap-2 tw:text-body-s tw:text-muted-foreground tw:md:grid-cols-3">
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
          <div className="tw:flex tw:items-center tw:gap-2">
            <dt className="tw:shrink-0">کد پستی</dt>
            <dd>
              <bdi dir="ltr">{address.postalCode}</bdi>
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
