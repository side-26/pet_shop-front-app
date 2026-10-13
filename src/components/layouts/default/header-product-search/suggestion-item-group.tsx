import { ItemGroup } from '@/components/ui/item';
import type { LandingSearchResultDTO } from '@/entities/landing/landing.dto';
import { cn } from '@/lib/utils';

import { useHeaderProductSearchContext } from './header-product-search-context';
import { HeaderProductSearchSuggestionItem } from './suggestion-item';

type HeaderProductSearchSuggestionItemGroupProps = Readonly<{
  data?: LandingSearchResultDTO[];
  isSkeleton?: boolean;
}>;

const skeletonItemCount = 3;

export function HeaderProductSearchSuggestionItemGroup({
  data = [],
  isSkeleton = false,
}: HeaderProductSearchSuggestionItemGroupProps) {
  const { onNavigateToDetail } = useHeaderProductSearchContext();
  const items: Array<LandingSearchResultDTO | undefined> = isSkeleton
    ? Array.from({ length: skeletonItemCount }, () => undefined)
    : data;

  return (
    <ItemGroup
      aria-busy={isSkeleton || undefined}
      className={cn(isSkeleton && 'skeleton tw:gap-3 tw:p-5 tw:pointer-events-none')}
    >
      {items.map((item, index) => (
        <HeaderProductSearchSuggestionItem
          key={item ? `${item.itemType}-${item.slug}` : index}
          item={item}
          isSkeleton={isSkeleton}
          onNavigateToDetail={onNavigateToDetail}
        />
      ))}
    </ItemGroup>
  );
}
