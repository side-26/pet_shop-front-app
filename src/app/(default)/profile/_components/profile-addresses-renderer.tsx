import type { ProfileAddressCardDTO } from '@/entities/profile/profile.dto';
import { cn } from '@/lib/utils';

import { CreateNewAddressButton } from './create-new-address-button';
import { ProfileAddressCard } from './profile-address-card';
import { ProfileAddressDialogsProvider } from './profile-address-dialogs-provider';

type Props = Readonly<{ addresses: readonly ProfileAddressCardDTO[]; isSkeleton?: boolean }>;

function AddAddressButton({ disabled }: Readonly<{ disabled?: boolean }>) {
  return <CreateNewAddressButton disabled={disabled} />;
}

export function ProfileAddressesRenderer({ addresses, isSkeleton = false }: Props) {
  return (
    <ProfileAddressDialogsProvider>
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

        <div className="tw:grid tw:gap-3 tw:md:grid-cols-2">
          {addresses.map((address, index) => (
            <ProfileAddressCard
              key={address.id ?? `${address.postalCode}-${index}`}
              address={address}
              isSkeleton={isSkeleton}
            />
          ))}
        </div>
        <div className="tw:flex tw:justify-center tw:pt-2">
          <AddAddressButton disabled={isSkeleton} />
        </div>
      </section>
    </ProfileAddressDialogsProvider>
  );
}
