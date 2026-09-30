import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CartItemDetailsDTO } from '@/entities/users/users.dto';

type CheckoutCartItemsRendererProps = Readonly<{
  isSkeleton?: boolean;
  items: readonly CartItemDetailsDTO[];
}>;

export function CheckoutCartItemsRenderer({
  isSkeleton = false,
  items,
}: CheckoutCartItemsRendererProps) {
  return (
    <ul
      aria-busy={isSkeleton || undefined}
      aria-label={isSkeleton ? 'در حال دریافت کالاهای سفارش' : 'کالاهای سفارش'}
      className={cn('tw:flex tw:flex-col tw:gap-3', isSkeleton && 'skeleton')}
    >
      {items.map((item) => (
        <li className="tw:flex tw:items-center tw:gap-3" key={item.id}>
          <span
            className="tw:relative tw:size-12 tw:shrink-0 tw:overflow-hidden tw:rounded-xl tw:bg-muted"
            style={
              item.mainThumbnailImage
                ? { backgroundImage: 'url(' + item.mainThumbnailImage + ')' }
                : undefined
            }
          >
            {isSkeleton ? null : (
              <Image
                alt={item.title}
                blurDataURL={item.mainThumbnailImage || undefined}
                className="tw:object-cover"
                fill
                placeholder={item.mainThumbnailImage ? 'blur' : 'empty'}
                sizes="48px"
                src={item.mainImage}
              />
            )}
          </span>
          <span className="tw:min-w-0 tw:flex-1 tw:truncate tw:text-body-s">{item.title}</span>
          <Badge color="secondary" size="sm" variant="tonal">
            {item.cartQuantity.toLocaleString('fa-IR')} عدد
          </Badge>
        </li>
      ))}
    </ul>
  );
}
