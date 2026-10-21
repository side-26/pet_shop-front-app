import { MapPin } from 'lucide-react';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

import { CreateNewAddressButton } from './create-new-address-button';
import { ProfileAddressDialogsProvider } from './profile-address-dialogs-provider';

export function ProfileAddressesEmpty() {
  return (
    <ProfileAddressDialogsProvider>
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
          <CreateNewAddressButton />
        </EmptyContent>
      </Empty>
    </ProfileAddressDialogsProvider>
  );
}
