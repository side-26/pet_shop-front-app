import type { Metadata } from 'next';
import { Heart } from 'lucide-react';
import { Suspense } from 'react';

import { WishListPageContent } from './_components/wish-list-page-content';
import { WishListErrorBoundary } from './_components/wish-list-error-boundary';
import { WishListRenderer } from './_components/wish-list-renderer';
import { wishListSkeletonData } from './_components/wish-list-skeleton-data';

export const metadata: Metadata = {
  title: 'علاقه‌مندی‌های من | پت شاپ پرشین',
  description: 'محصولات و حیوانات ذخیره‌شده در فهرست علاقه‌مندی‌های شما.',
};

export default function WishListPage() {
  return (
    <main className="tw:default-layout-container tw:py-10 tw:sm:py-14 tw:lg:py-20">
      <header className="tw:mb-8 tw:flex tw:items-center tw:gap-3 tw:sm:mb-10">
        <span className="tw:flex tw:size-11 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-primary-muted tw:text-primary-muted-foreground">
          <Heart aria-hidden="true" />
        </span>
        <div>
          <h1 className="tw:text-heading-2 tw:sm:text-heading-1">علاقه‌مندی‌های من</h1>
        </div>
      </header>
      <Suspense fallback={<WishListRenderer items={wishListSkeletonData} isSkeleton />}>
        <WishListErrorBoundary>
          <WishListPageContent />
        </WishListErrorBoundary>
      </Suspense>
    </main>
  );
}
