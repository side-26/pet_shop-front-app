import type { ButtonProps } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  type PaginationLinkProps,
} from '@/components/ui/pagination';
import { ShowcaseSection } from './showcase-section';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
const modes = [
  ['fill', 'primary'],
  ['outlined', 'secondary'],
  ['tonal', 'info'],
  ['flat', 'success'],
  ['text', 'warning'],
  ['transparent', 'error'],
] as const satisfies ReadonlyArray<
  [NonNullable<ButtonProps['variant']>, NonNullable<ButtonProps['color']>]
>;

function PaginationExample({
  size = 'md',
  variant,
  color = 'primary',
}: Pick<PaginationLinkProps, 'size' | 'variant' | 'color'>) {
  const shared = { size, variant, color };
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="?page=1" {...shared} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=1" {...shared}>
            ۱
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=2" isActive aria-label="صفحه ۲" {...shared}>
            ۲
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=8" {...shared}>
            ۸
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="?page=3" {...shared} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export function PaginationShowcase() {
  return (
    <ShowcaseSection
      id="paginations"
      title="Pagination"
      description="صفحه‌بندی RTL با همه اندازه‌ها، رنگ‌های معنایی و حالت‌های fill، outlined، tonal، flat، text و transparent."
    >
      <div className="tw:flex tw:flex-col tw:gap-7">
        <div className="tw:flex tw:flex-col tw:gap-4">
          {sizes.map((size) => (
            <PaginationExample key={size} size={size} />
          ))}
        </div>
        <div className="tw:flex tw:flex-col tw:gap-4">
          {modes.map(([variant, color]) => (
            <PaginationExample key={`${variant}-${color}`} variant={variant} color={color} />
          ))}
        </div>
      </div>
    </ShowcaseSection>
  );
}
