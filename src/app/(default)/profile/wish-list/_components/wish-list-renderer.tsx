import { ItemGroup } from '@/components/ui/item';
import { cn } from '@/lib/utils';

import { WishListItem } from './wish-list-item';
import type { WishListItemViewModel } from './wish-list.types';

type WishListRendererProps = Readonly<{
  items: readonly WishListItemViewModel[];
  isSkeleton?: boolean;
}>;

export function WishListRenderer({ items, isSkeleton = false }: WishListRendererProps) {
  return (
    <ItemGroup
      aria-busy={isSkeleton || undefined}
      aria-label="فهرست علاقه‌مندی‌ها"
      className={cn(
        'tw:grid tw:grid-cols-2 tw:gap-3 tw:lg:grid-cols-3 tw:lg:gap-5',
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      {items.map((item) => (
        <WishListItem key={item.id} item={item} isSkeleton={isSkeleton} />
      ))}
    </ItemGroup>
  );
}
