import { Trash2 } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';

import type { WishListItemViewModel } from './wish-list.types';

type WishListItemProps = Readonly<{
  item: WishListItemViewModel;
  isSkeleton?: boolean;
}>;

/** A wishlist entry; removal remains intentionally unavailable until its mutation is introduced. */
export function WishListItem({ item, isSkeleton = false }: WishListItemProps) {
  return (
    <Item
      render={<li />}
      variant="glassy"
      className="tw:relative tw:flex-col tw:items-stretch tw:gap-3 tw:p-3"
    >
      <ItemMedia className="tw:relative tw:aspect-square tw:w-full tw:overflow-hidden tw:rounded-xl tw:bg-muted">
        {isSkeleton ? (
          <div className="tw:absolute tw:inset-0" />
        ) : (
          <Image
            fill
            alt={`تصویر ${item.itemType === 'product' ? 'محصول' : 'حیوان'} ${item.title}`}
            blurDataURL={item.thumbnailImage}
            className="tw:object-cover"
            placeholder={item.thumbnailImage ? 'blur' : 'empty'}
            sizes="(min-width: 1024px) 33vw, 50vw"
            src={item.mainImage}
          />
        )}
      </ItemMedia>
      <ItemContent className="tw:mt-auto tw:pe-9">
        <ItemTitle className="tw:line-clamp-2 tw:min-h-[3rem] tw:whitespace-normal">
          {item.title}
        </ItemTitle>
      </ItemContent>
      <ItemActions className="tw:absolute tw:bottom-3 tw:end-3">
        <Button
          aria-label={`حذف ${item.title} از علاقه‌مندی‌ها`}
          color="error"
          disabled
          iconOnly
          size="sm"
          type="button"
          variant="flat"
        >
          <Trash2 aria-hidden="true" />
        </Button>
      </ItemActions>
    </Item>
  );
}
