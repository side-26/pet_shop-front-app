import { getProfileAccountAction } from '@/entities/profile/profile.actions';

import { ProfileIdentityContent } from './profile-identity-content';
import { ProfileAddressesWrapper } from './profile-addresses-wrapper';
import { ProfileHeaderWrapper } from './profile-header-wrapper';
import { ProfileOrdersWrapper } from './profile-orders-wrapper';

export function ProfilePageContent() {
  return (
    <div className="tw:relative tw:overflow-hidden tw:py-8 tw:sm:py-10 tw:lg:py-14 tw:lg:[--text-heading-3:1.25rem] tw:lg:[--text-title-l:1.125rem] tw:lg:[--text-title-m:1rem] tw:lg:[--text-title-s:0.9375rem] tw:lg:[--text-body-m:0.9375rem] tw:lg:[--text-body-s:0.8125rem] tw:lg:[--text-label-l:0.9375rem] tw:lg:[--text-label-m:0.8125rem]">
      <div
        aria-hidden="true"
        className="tw:pointer-events-none tw:absolute tw:inset-x-0 tw:top-0 tw:-z-10 tw:h-80 tw:bg-[radial-gradient(circle_at_top_right,var(--primary-muted),transparent_58%)] tw:opacity-75"
      />
      <div className="tw:default-layout-container tw:flex tw:flex-col tw:gap-6 tw:sm:gap-8">
        <ProfileIdentityContent
          addresses={<ProfileAddressesWrapper />}
          header={<ProfileHeaderWrapper />}
          orders={<ProfileOrdersWrapper />}
        />
      </div>
    </div>
  );
}
