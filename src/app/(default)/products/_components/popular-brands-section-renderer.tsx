import Image from 'next/image';
import Link from 'next/link';

import { routePaths } from '@/configs/route.path';
import type { LandingPopularBrandDTO } from '@/entities/landing/landing.dto';
import { cn } from '@/lib/utils';

type PopularBrandsSectionRendererProps = Readonly<{
  brands: readonly LandingPopularBrandDTO[];
  isSkeleton?: boolean;
}>;

export function PopularBrandsSectionRenderer({
  brands,
  isSkeleton = false,
}: PopularBrandsSectionRendererProps) {
  return (
    <div
      aria-busy={isSkeleton || undefined}
      className={cn(
        'tw:grid tw:grid-cols-2 tw:gap-3 tw:sm:grid-cols-3 tw:md:grid-cols-5 tw:md:gap-5',
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      {brands.map((brand) => (
        <Link
          key={brand.id}
          href={routePaths.productsListByBrand(brand.title)}
          prefetch
          aria-label={isSkeleton ? undefined : `محصولات برند ${brand.title_fa ?? brand.title}`}
          aria-disabled={isSkeleton || undefined}
          tabIndex={isSkeleton ? -1 : undefined}
          className="tw:group tw:flex tw:aspect-[3/2] tw:items-center tw:justify-center tw:rounded-2xl tw:border tw:border-border/60 tw:bg-card tw:p-5 tw:outline-none tw:transition-[border-color,box-shadow,transform] tw:duration-300 tw:hover:-translate-y-0.5 tw:hover:border-primary/40 tw:hover:shadow-md tw:focus-visible:ring-3 tw:focus-visible:ring-primary/25 tw:motion-reduce:transition-none tw:motion-reduce:hover:transform-none"
        >
          {isSkeleton ? (
            <div className="tw:size-full tw:rounded-lg" />
          ) : (
            <Image
              src={brand.logo}
              alt={`لوگوی ${brand.title_fa ?? brand.title}`}
              width={180}
              height={96}
              placeholder={brand.thumbnailLogo ? 'blur' : 'empty'}
              blurDataURL={brand.thumbnailLogo}
              className="tw:max-h-16 tw:w-auto tw:max-w-full tw:object-contain tw:grayscale tw:opacity-65 tw:transition-[filter,opacity,transform] tw:duration-300 tw:group-hover:scale-105 tw:group-hover:grayscale-0 tw:group-hover:opacity-100 tw:motion-reduce:transition-none tw:motion-reduce:group-hover:transform-none"
            />
          )}
        </Link>
      ))}
    </div>
  );
}
