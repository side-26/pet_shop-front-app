import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  type ItemProps,
} from '@/components/ui/item';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import { ShowcaseSection } from './showcase-section';

const variants = ['default', 'tonal', 'fill', 'glassy'] as const satisfies ReadonlyArray<
  NonNullable<ItemProps['variant']>
>;
const colors = [
  'primary',
  'secondary',
  'foreground',
  'success',
  'error',
] as const satisfies ReadonlyArray<NonNullable<ItemProps['color']>>;

export function ItemShowcase() {
  return (
    <ShowcaseSection
      id="items"
      title="Item"
      description="ردیف‌های فشرده و قابل‌استفاده‌مجدد برای فهرست‌ها، با سطح و رنگ معنایی."
    >
      <ItemGroup className="tw:grid tw:gap-3 tw:lg:grid-cols-2">
        {variants.flatMap((variant) =>
          colors.map((color) => (
            <Item key={`${variant}-${color}`} render={<li />} variant={variant} color={color}>
              <ItemMedia>
                <Avatar size="default">
                  <AvatarFallback>پ</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>آیتم نمونه {variant}</ItemTitle>
              </ItemContent>
              <ItemActions>
                <Button
                  type="button"
                  variant="text"
                  color={color === 'foreground' ? 'primary' : color}
                  size="sm"
                >
                  مشاهده
                </Button>
              </ItemActions>
            </Item>
          )),
        )}
      </ItemGroup>
    </ShowcaseSection>
  );
}
