import Image from 'next/image';
import Link from 'next/link';

import { routePaths } from '@/configs/route.path';
import { cn } from '@/lib/utils';

type BrandProps = Readonly<{
  size?: 'compact' | 'default';
  showName?: boolean;
  className?: string;
}>;

export function Brand({ size = 'default', showName = true, className }: BrandProps) {
  const isCompact = size === 'compact';

  return (
    <Link
      href={routePaths.home}
      aria-label="پناهگاه حیوانات پرشین، صفحه اصلی"
      className={cn(
        'tw:inline-flex tw:shrink-0 tw:items-center tw:gap-2.5 tw:rounded-xl tw:outline-none tw:focus-visible:ring-3 tw:focus-visible:ring-primary/25',
        className,
      )}
    >
      <span
        className={cn(
          'tw:relative tw:block tw:shrink-0 tw:drop-shadow-sm',
          isCompact ? 'tw:size-10' : 'tw:size-13',
        )}
        aria-hidden="true"
      >
        <Image
          src="/images/brand/pet-haven-mark.png"
          alt=""
          fill
          loading={isCompact ? 'eager' : 'lazy'}
          sizes={isCompact ? '40px' : '52px'}
          className="tw:object-contain"
        />
      </span>

      {showName ? (
        <span
          className={cn(
            'tw:font-bold tw:text-primary',
            isCompact
              ? 'tw:text-title-s tw:sm:text-title-m'
              : 'tw:text-title-m tw:lg:text-heading-3',
          )}
        >
          پناهگاه پرشین
        </span>
      ) : null}
    </Link>
  );
}
