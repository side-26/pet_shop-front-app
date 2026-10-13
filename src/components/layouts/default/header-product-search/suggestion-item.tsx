import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import { routePaths } from '@/configs/route.path';
import type { LandingSearchResultDTO } from '@/entities/landing/landing.dto';
import { cn } from '@/lib/utils';

type HeaderProductSearchSuggestionItemProps = Readonly<{
  item?: LandingSearchResultDTO;
  isSkeleton?: boolean;
  onCloseHoverCard?: () => void;
}>;

export function HeaderProductSearchSuggestionItem({
  item,
  isSkeleton = false,
  onCloseHoverCard,
}: HeaderProductSearchSuggestionItemProps) {
  const detailHref =
    item?.itemType === 'pet'
      ? routePaths.petDetail(item.slug)
      : routePaths.productDetail(item?.slug ?? '');

  return (
    <Item render={<li />}>
      <ItemMedia>
        <Avatar size="lg" className={cn(isSkeleton && 'tw:bg-muted')}>
          <AvatarImage src={item?.mainImage} alt="" />
          <AvatarFallback>{item?.title.trim().at(0)}</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle className={cn(isSkeleton && 'tw:h-4 tw:rounded tw:bg-muted')}>
          {isSkeleton ? <span className="tw:sr-only">در حال بارگذاری</span> : item?.title}
        </ItemTitle>
      </ItemContent>
      <ItemActions>
        {isSkeleton ? (
          <span className="tw:block tw:h-4 tw:w-20 tw:rounded tw:bg-muted" />
        ) : (
          <Link
            href={detailHref}
            prefetch
            onClick={onCloseHoverCard}
            className={buttonVariants({ color: 'primary', size: 'sm', variant: 'text' })}
          >
            مشاهده جزئیات
          </Link>
        )}
      </ItemActions>
    </Item>
  );
}
